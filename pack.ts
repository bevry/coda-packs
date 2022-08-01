import * as coda from '@codahq/packs-sdk'
import type { AttributionNode } from '@codahq/packs-sdk'
import {
	CoinsResponse,
	Coin,
	CoinDetails,
	CoinHistoricalResponse,
	CoinMarketReponse,
	Currencies,
	CoinBaseReponse,
} from './types'

export const pack = coda.newPack()

// https://www.coingecko.com/en/api/documentation
pack.addNetworkDomain('api.coingecko.com')

const Attribution: AttributionNode[] = [
	{
		type: coda.AttributionNodeType.Text,
		text: 'Provided by CoinGecko',
	},
	{
		type: coda.AttributionNodeType.Link,
		anchorText: 'coingecko.com',
		anchorUrl: 'https://coingecko.com',
	},
	{
		type: coda.AttributionNodeType.Image,
		imageUrl: 'https://coingecko.com/favicon.ico',
		anchorUrl: 'https://coingecko.com',
	},
]

const CoinSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description:
				'CoinGecko Identifier for the Coin, e.g. `1x-short-bitcoin-token`',
			type: coda.ValueType.String,
			required: true,
		},
		symbol: {
			description: 'Symbol of the Coin used across exchanges, e.g. `hedge`',
			type: coda.ValueType.String,
			required: true,
		},
		name: {
			description: 'Name of the Coin, e.g. `1X Short Bitcoin Token`',
			type: coda.ValueType.String,
			required: true,
		},
		url: {
			description:
				'URL of the Coin, e.g. https://coingecko.com/coins/1x-short-bitcoin-token',
			type: coda.ValueType.String,
			codaType: coda.ValueHintType.Url,
			required: true,
		},
	},
	identity: {
		name: 'Coin',
	},
	idProperty: 'id',
	displayProperty: 'name',
	descriptionProperty: 'url',
	featuredProperties: ['symbol', 'name', 'url'],
	attribution: Attribution,
})

const CoinSearchParam = coda.makeParameter({
	name: 'Coin Search',
	description:
		'Filters results by coins that contains the search value inside their name.',
	type: coda.ParameterType.String,
	suggestedValue: 'Bitcoin',
	optional: true,
})
const CoinIdParam = coda.makeParameter({
	name: 'Coin ID',
	description:
		'Use `Coins` sync table to get a list of supported coins, otherwise use the URL: https://coingecko.com/coins/<identifier>',
	type: coda.ParameterType.String,
	suggestedValue: 'bitcoin',
})
const CurrencyParam = coda.makeParameter({
	name: 'Currency ID',
	description: 'Use `GetCurrencies` to get a list of supported currencies',
	type: coda.ParameterType.String,
	suggestedValue: 'usd',
	optional: true,
})
const WhenParam = coda.makeParameter({
	name: 'When',
	description: 'The date identifier: <dd-mm-yyyy>, eg. 30-12-2017',
	type: coda.ParameterType.Date,
	optional: true,
})

// const CoinReferenceSchema = coda.makeReferenceSchemaFromObjectSchema(
// 	CoinSchema,
// 	'Coin'
// )

// TODO
// Filter coins by search
// Coin fetch
// Coin currency comparison fetch

function parseCoinIdentifier(input: string) {
	const match = input.match('^https?://.*?coingecko.com/.*coins/(.+)$')
	return match ? match[1] : input
}
function addCoinUrl(coin: Coin) {
	return {
		...coin,
		url: `https://coingecko.com/coins/${coin.id}`,
	}
}

// Coins fetch
pack.addSyncTable({
	name: 'Coins',
	schema: CoinSchema,
	identityName: 'Coin',
	formula: {
		name: 'SyncCoins',
		description: 'Sync coins from CoinGecko.',
		parameters: [CoinSearchParam],
		execute: async function ([search = ''], context) {
			// https://coda.io/packs/build/latest/guides/advanced/fetcher/#json_1
			const url = `https://api.coingecko.com/api/v3/coins/list`
			const response = await context.fetcher.fetch<CoinsResponse>({
				method: 'GET',
				url: url,
			})
			const needle = search.toLowerCase()
			const everything: Array<Coin> = response.body.map(addCoinUrl)
			const filtered = everything
				? everything.filter((coin) => coin.name.toLowerCase().includes(needle))
				: everything
			return { result: filtered }
		},
	},
})

// Coin fetch and column format
pack.addFormula({
	name: 'GetCoin',
	description: 'Fetch information for a coin identifier.',
	resultType: coda.ValueType.Object,
	schema: CoinSchema,
	parameters: [CoinIdParam],
	execute: async function ([input], context) {
		const id = parseCoinIdentifier(input)
		const url = coda.withQueryParams(
			`https://api.coingecko.com/api/v3/coins/${id}`,
			{
				market_data: false,
				localization: false,
				tickers: false,
				community_data: false,
				developer_data: false,
				sparkline: false,
			}
		)
		const response = await context.fetcher.fetch<CoinBaseReponse>({
			method: 'GET',
			url: url,
		})
		const result = addCoinUrl(response.body)
		return result
	},
})
pack.addColumnFormat({
	name: 'Coin',
	formulaName: 'GetCoin',
})

// Currencies fetch
const CurrencySchema = coda.makeSchema({
	type: coda.ValueType.String,
})
pack.addFormula({
	name: 'GetCurrencies',
	description: 'Fetch currencies from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: CurrencySchema,
	parameters: [],
	execute: async function ([], context) {
		// https://coda.io/packs/build/latest/guides/advanced/fetcher/#json_1
		const url =
			'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
		const response = await context.fetcher.fetch<Currencies>({
			method: 'GET',
			url: url,
		})
		const result: Currencies = response.body
		return result
	},
})

// Coin currency fetch
const CoinCurrencySchema = coda.makeSchema({
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Currency,
	// currencyCode: 'USD',
	// precision: 2,
})
pack.addFormula({
	name: 'GetCoinCurrency',
	description: 'Fetch historical currency price data for a coin identifier.',
	resultType: coda.ValueType.Number,
	schema: CoinCurrencySchema,
	parameters: [CoinIdParam, CurrencyParam, WhenParam],
	execute: async function ([id, currency = 'usd', when = new Date()], context) {
		const url = coda.withQueryParams(
			`https://api.coingecko.com/api/v3/coins/${id}/history`,
			{
				date: `${when.getDate()}-${when.getMonth() + 1}-${when.getFullYear()}`,
				localization: false,
			}
		)
		const response = await context.fetcher.fetch<CoinHistoricalResponse>({
			method: 'GET',
			url: url,
		})
		const result = response.body
		const prices = result.market_data.current_price
		const price = prices[currency.toLowerCase()]
		if (!price) {
			const currencies = Object.keys(prices).sort().join(', ')
			throw new coda.UserVisibleError(
				`Invalid currency [${currency}]. Available currencies are: ${currencies}`
			)
		}
		return price
	},
})
