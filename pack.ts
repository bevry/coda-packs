import * as coda from '@codahq/packs-sdk'
import type { AttributionNode } from '@codahq/packs-sdk'
import {
	CoinsListingResponse,
	SearchResponse,
	Coin,
	Currencies,
	CoinResponse,
	ExchangeRatesResponse,
	ExchangeRate,
	TrendingResponse,
	CategoriesResponse,
	Category,
	GlobalMarket,
	GlobalMarketResponse,
	DefiMarketResponse,
	DefiMarket,
	CoinDetails,
	CoinHistoryResponse,
	CoinMarket,
} from './types'

// ====================================
// CODA BASE

export const pack = coda.newPack()

const minute = 60
const hour = minute * 60
const day = hour * 24

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

// ====================================
// HELPERS

function parseCoinUrlIdentifier(input: string): string {
	const match = input.match('^https?://.*?coingecko.com/.*?coins/(.+?)(@.+)?$')
	const identifier = match ? match[1] : input
	return identifier.toLowerCase()
}
function parseCoinMarketIdentifier(input: string): string {
	const match = input.match('^(.+?)(@.+)?$')
	const identifier = match ? match[1] : input
	return identifier.toLowerCase()
}
function parseCoinIdentifier(input: string): string {
	return parseCoinUrlIdentifier(parseCoinMarketIdentifier(input))
}
function parseCoinWhen(input: string, fallback = new Date()): Date {
	const match = input.match('^.+?@(.+)$')
	const when = match ? new Date(match[1]) : fallback
	return when
}
function getCoinUrl(id: string) {
	return `https://coingecko.com/coins/${id}`
}

// ====================================
// CODA SCHEMES

const usdSchema: coda.CurrencySchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Currency,
	currencyCode: 'USD',
	precision: 2,
	// format?: CurrencyFormat;
}
const currencySchema: coda.CurrencySchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Currency,
	precision: 2,
}
const percentSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Percent,
	useThousandsSeparator: true,
	precision: 2,
}
const minutesSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	useThousandsSeparator: true,
}
const stringSchema: coda.StringSchema = {
	type: coda.ValueType.String,
}
const numberSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	useThousandsSeparator: true,
	precision: 2,
}
const datetimeStringSchema: coda.StringSchema | coda.StringDateTimeSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.DateTime,
}
const datetimeNumberSchema: coda.NumberSchema | coda.NumericDateTimeSchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.DateTime,
}
const urlSchema: coda.StringSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.Url,
}
const imageSchema: coda.StringSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.ImageReference,
}
const linkSchema: coda.ArraySchema = {
	type: coda.ValueType.Array,
	items: {
		type: coda.ValueType.String,
	},
}

// Defi Market
const DefiMarketSchema = coda.makeObjectSchema({
	properties: {
		volume_24h_usd: {
			description: 'Volume in USD (24 Hours)',
			required: true,
			...usdSchema,
		},
		market_cap_usd: {
			description: 'Market Cap in USD',
			required: true,
			...usdSchema,
		},
		defi_dominance: {
			description: 'Defi Dominance',
			required: true,
			...percentSchema,
		},
	},
	identity: {
		name: 'DefiMarket',
	},
	displayProperty: 'market_cap_usd',
	featuredProperties: ['volume_24h_usd', 'market_cap_usd', 'defi_dominance'],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Coin Market Data
const CurrencyComparisonSchema = coda.makeObjectSchema({
	properties: {
		btc: {
			description: 'BTC',
			required: true,
			...currencySchema,
		},
		eth: {
			description: 'ETH',
			required: true,
			...currencySchema,
		},
		ltc: {
			description: 'LTC',
			required: true,
			...currencySchema,
		},
		bch: {
			description: 'BCH',
			required: true,
			...currencySchema,
		},
		bnb: {
			description: 'BNB',
			required: true,
			...currencySchema,
		},
		eos: {
			description: 'EOS',
			required: true,
			...currencySchema,
		},
		xrp: {
			description: 'XRP',
			required: true,
			...currencySchema,
		},
		xlm: {
			description: 'XLM',
			required: true,
			...currencySchema,
		},
		link: {
			description: 'LIN',
			required: true,
			...currencySchema,
		},
		dot: {
			description: 'DOT',
			required: true,
			...currencySchema,
		},
		yfi: {
			description: 'YFI',
			required: true,
			...currencySchema,
		},
		usd: {
			description: 'USD',
			required: true,
			...currencySchema,
		},
		aed: {
			description: 'AED',
			required: true,
			...currencySchema,
		},
		ars: {
			description: 'ARS',
			required: true,
			...currencySchema,
		},
		aud: {
			description: 'AUD',
			required: true,
			...currencySchema,
		},
		bdt: {
			description: 'BDT',
			required: true,
			...currencySchema,
		},
		bhd: {
			description: 'BHD',
			required: true,
			...currencySchema,
		},
		bmd: {
			description: 'BMD',
			required: true,
			...currencySchema,
		},
		brl: {
			description: 'BRL',
			required: true,
			...currencySchema,
		},
		cad: {
			description: 'CAD',
			required: true,
			...currencySchema,
		},
		chf: {
			description: 'CHF',
			required: true,
			...currencySchema,
		},
		clp: {
			description: 'CLP',
			required: true,
			...currencySchema,
		},
		cny: {
			description: 'CNY',
			required: true,
			...currencySchema,
		},
		czk: {
			description: 'CZK',
			required: true,
			...currencySchema,
		},
		dkk: {
			description: 'DKK',
			required: true,
			...currencySchema,
		},
		eur: {
			description: 'EUR',
			required: true,
			...currencySchema,
		},
		gbp: {
			description: 'GBP',
			required: true,
			...currencySchema,
		},
		hkd: {
			description: 'HKD',
			required: true,
			...currencySchema,
		},
		huf: {
			description: 'HUF',
			required: true,
			...currencySchema,
		},
		idr: {
			description: 'IDR',
			required: true,
			...currencySchema,
		},
		ils: {
			description: 'ILS',
			required: true,
			...currencySchema,
		},
		inr: {
			description: 'INR',
			required: true,
			...currencySchema,
		},
		jpy: {
			description: 'JPY',
			required: true,
			...currencySchema,
		},
		krw: {
			description: 'KRW',
			required: true,
			...currencySchema,
		},
		kwd: {
			description: 'KWD',
			required: true,
			...currencySchema,
		},
		lkr: {
			description: 'LKR',
			required: true,
			...currencySchema,
		},
		mmk: {
			description: 'MMK',
			required: true,
			...currencySchema,
		},
		mxn: {
			description: 'MXN',
			required: true,
			...currencySchema,
		},
		myr: {
			description: 'MYR',
			required: true,
			...currencySchema,
		},
		ngn: {
			description: 'NGN',
			required: true,
			...currencySchema,
		},
		nok: {
			description: 'NOK',
			required: true,
			...currencySchema,
		},
		nzd: {
			description: 'NZD',
			required: true,
			...currencySchema,
		},
		php: {
			description: 'PHP',
			required: true,
			...currencySchema,
		},
		pkr: {
			description: 'PKR',
			required: true,
			...currencySchema,
		},
		pln: {
			description: 'PLN',
			required: true,
			...currencySchema,
		},
		rub: {
			description: 'RUB',
			required: true,
			...currencySchema,
		},
		sar: {
			description: 'SAR',
			required: true,
			...currencySchema,
		},
		sek: {
			description: 'SEK',
			required: true,
			...currencySchema,
		},
		sgd: {
			description: 'SGD',
			required: true,
			...currencySchema,
		},
		thb: {
			description: 'THB',
			required: true,
			...currencySchema,
		},
		try: {
			description: 'TRY',
			required: true,
			...currencySchema,
		},
		twd: {
			description: 'TWD',
			required: true,
			...currencySchema,
		},
		uah: {
			description: 'UAH',
			required: true,
			...currencySchema,
		},
		vef: {
			description: 'VEF',
			required: true,
			...currencySchema,
		},
		vnd: {
			description: 'VND',
			required: true,
			...currencySchema,
		},
		zar: {
			description: 'ZAR',
			required: true,
			...currencySchema,
		},
		xdr: {
			description: 'XDR',
			required: true,
			...currencySchema,
		},
		xag: {
			description: 'XAG',
			required: true,
			...currencySchema,
		},
		xau: {
			description: 'XAU',
			required: true,
			...currencySchema,
		},
		bits: {
			description: 'BIT',
			required: true,
			...currencySchema,
		},
		sats: {
			description: 'SAT',
			required: true,
			...currencySchema,
		},
	},
	identity: {
		name: 'CurrencyCompparison',
	},
	displayProperty: 'usd',
	featuredProperties: ['usd', 'btc', 'eth', 'eur'],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Market Ratios
const GlobalMarketRatiosSchema = coda.makeObjectSchema({
	properties: {
		btc: {
			description: 'BTC dominance',
			required: true,
			...percentSchema,
		},
		eth: {
			description: 'ETH dominance',
			required: true,
			...percentSchema,
		},
		usdt: {
			description: 'USDT dominance',
			required: true,
			...percentSchema,
		},
		usdc: {
			description: 'USDC dominance',
			required: true,
			...percentSchema,
		},
		bnb: {
			description: 'BNB dominance',
			required: true,
			...percentSchema,
		},
		xrp: {
			description: 'XRP dominance',
			required: true,
			...percentSchema,
		},
		busd: {
			description: 'BUSD dominance',
			required: true,
			...percentSchema,
		},
		ada: {
			description: 'ADA dominance',
			required: true,
			...percentSchema,
		},
		sol: {
			description: 'SOL dominance',
			required: true,
			...percentSchema,
		},
		dot: {
			description: 'DOT dominance',
			required: true,
			...percentSchema,
		},
	},
	identity: {
		name: 'MarketRatios',
	},
	displayProperty: 'btc',
	featuredProperties: ['btc', 'eth', 'usdt', 'usdc'],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Global Market
const GlobalMarketSchema = coda.makeObjectSchema({
	properties: {
		active_cryptocurrencies: {
			description: 'Count of Active Cryptocurrencies',
			required: true,
			...numberSchema,
		},
		upcoming_icos: {
			description: 'Count of Upcoming ICOs',
			required: true,
			...numberSchema,
		},
		ongoing_icos: {
			description: 'Count of Ended ICOs',
			required: true,
			...numberSchema,
		},
		markets: {
			description: 'Count of Markets',
			required: true,
			...numberSchema,
		},
		volume_usd: {
			description: 'Volume in USD',
			required: true,
			...usdSchema,
		},
		market_cap_usd: {
			description: 'Market Cap in USD',
			required: true,
			...usdSchema,
		},
		market_cap_24h_percent: {
			description: 'Market Cap % Change (24 Hours)',
			required: true,
			...percentSchema,
		},
		market_ratios: GlobalMarketRatiosSchema,
		updated_at: {
			description: 'Last Updated',
			required: true,
			...datetimeNumberSchema,
		},
	},
	identity: {
		name: 'GlobalMarket',
	},
	idProperty: 'updated_at',
	displayProperty: 'market_cap_usd',
	featuredProperties: [
		'volume_usd',
		'market_cap_usd',
		'market_cap_24h_percent',
		'market_ratios',
	],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Category
const CategorySchema = coda.makeObjectSchema({
	properties: {
		id: {
			description:
				'CoinGecko Identifier for the Category, e.g. `binance-smart-chain`',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name, e.g. `BNB Chain Ecosystem`',
			required: true,
			...stringSchema,
		},
		description: {
			description: 'Description',
			required: true,
			...stringSchema,
		},
		volume_24h_usd: {
			description: 'Volume in USD (24 Hours), e.g. `83554662546.89467`',
			required: true,
			...usdSchema,
		},
		market_cap_usd: {
			description: 'Market Cap in USD, e.g. `249398905817.62985`',
			required: true,
			...usdSchema,
		},
		market_cap_24h_percent: {
			description: 'Market Cap % Change (24 Hours), e.g. `-0.7515690936538925`',
			required: true,
			...percentSchema,
		},
		updated_at: {
			description: 'Last Updated',
			required: true,
			...datetimeStringSchema,
		},
	},
	identity: {
		name: 'Category',
	},
	idProperty: 'id',
	displayProperty: 'name',
	descriptionProperty: 'description',
	// title, subtitle
	featuredProperties: [
		'name',
		'volume_24h_usd',
		'market_cap_usd',
		'market_cap_24h_percent',
		'description',
	],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Exchange Rate
const ExchangeRateSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'CoinGecko Identifier for the Currency, e.g. `chf`',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name, e.g. `Swiss Franc`',
			required: true,
			...stringSchema,
		},
		unit: {
			description: 'Unit, e.g. `Fr.`',
			required: true,
			...stringSchema,
		},
		value: {
			description: 'BTC-to-Currency exchange rate',
			required: true,
			...numberSchema,
		},
		type: {
			description: '`fiat` or `crypto`',
			required: true,
			...stringSchema,
		},
	},
	identity: {
		name: 'BitcoinExchangeRate',
	},
	idProperty: 'id',
	displayProperty: 'name',
	// title, subtitle
	featuredProperties: ['name', 'unit', 'value', 'type'],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// Currencies
const CurrencySchema = coda.makeSchema({
	...stringSchema,
})

// Coin Currency
// const CoinCurrencySchema = coda.makeSchema({
// 	...currencySchema,
// })

// Coin
const CoinSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description:
				'CoinGecko Identifier for the Coin, e.g. `1x-short-bitcoin-token`',
			required: true,
			...stringSchema,
		},
		symbol: {
			description: 'Symbol of the Coin used across exchanges, e.g. `hedge`',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name of the Coin, e.g. `1X Short Bitcoin Token`',
			required: true,
			...stringSchema,
		},
		url: {
			description:
				'URL of the Coin, e.g. https://coingecko.com/coins/1x-short-bitcoin-token',
			required: true,
			...urlSchema,
		},
		image: {
			description: 'Image of the Coin',
			required: false,
			...imageSchema,
		},
	},
	identity: {
		name: 'Coin',
	},
	idProperty: 'id',
	displayProperty: 'name',
	descriptionProperty: 'url',
	imageProperty: 'image',
	// title, subtitle
	featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution: Attribution,
	includeUnknownProperties: false,
})
const CoinMarketSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description:
				'Identifier for the Coin Market, e.g. `1x-short-bitcoin-token@2022-08-03T00:36:23.098Z`',
			required: true,
			...stringSchema,
		},
		coin: CoinSchema,
		when: {
			description: 'Date of this data',
			required: true,
			...datetimeStringSchema,
		},
		price_usd: {
			description: 'Price in USD',
			required: true,
			...usdSchema,
		},
		price_btc: {
			description: 'Price in BTC',
			required: true,
			...currencySchema,
		},
		volume_usd: {
			description: 'Volume in USD',
			required: true,
			...usdSchema,
		},
		volume_btc: {
			description: 'Volume in BTC',
			required: true,
			...currencySchema,
		},
		market_cap_usd: {
			description: 'Market Cap in USD',
			required: true,
			...usdSchema,
		},
		market_cap_btc: {
			description: 'Market Cap in BTC',
			required: true,
			...currencySchema,
		},
		// market
		price: CurrencyComparisonSchema,
		volume: CurrencyComparisonSchema,
		market_cap: CurrencyComparisonSchema,
		// community
		facebook_likes: {
			description: 'Number of Facebook likes',
			required: false,
			...numberSchema,
		},
		twitter_followers: {
			description: 'Number of Twitter followers',
			required: false,
			...numberSchema,
		},
		reddit_average_posts_48h: {
			description: 'Number of Reddit average posts (48 hours)',
			required: false,
			...numberSchema,
		},
		reddit_average_comments_48h: {
			description: 'Number of Reddit average comments (48 hours)',
			required: false,
			...numberSchema,
		},
		reddit_subscribers: {
			description: 'Number of Reddit subscribers',
			required: false,
			...numberSchema,
		},
		reddit_accounts_active_48h: {
			description: 'Number of Reddit accounts active (48 hours)',
			required: false,
			...numberSchema,
		},
		telegram_channel_user_count: {
			description: 'Number of Telegram channel user count',
			required: false,
			...numberSchema,
		},
		// developer
		forks: {
			description: 'Number of forks',
			required: false,
			...numberSchema,
		},
		stars: {
			description: 'Number of stars',
			required: false,
			...numberSchema,
		},
		subscribers: {
			description: 'Number of subscribers',
			required: false,
			...numberSchema,
		},
		total_issues: {
			description: 'Number of total issues',
			required: false,
			...numberSchema,
		},
		closed_issues: {
			description: 'Number of closed issues',
			required: false,
			...numberSchema,
		},
		pull_requests_merged: {
			description: 'Number of pull requests merged',
			required: false,
			...numberSchema,
		},
		pull_request_contributors: {
			description: 'Number of pull request contributors',
			required: false,
			...numberSchema,
		},
		commit_count_4_weeks: {
			description: 'Number of commit count (4 weeks)',
			required: false,
			...numberSchema,
		},
		// public interest
		alexa_rank: {
			description: 'Alexa Rank',
			required: false,
			...numberSchema,
		},
		bing_matches: {
			description: 'Bing Matches',
			required: false,
			...numberSchema,
		},
	},
	identity: {
		name: 'CoinMarket',
	},
	idProperty: 'id',
	displayProperty: 'price_usd', // 'coin',
	// title, subtitle
	featuredProperties: [
		'id',
		'when',
		'price_usd',
		'price_btc',
		'volume_usd',
		'volume_btc',
		'market_cap_usd',
		'market_cap_btc',
		'price',
		'volume',
		'market_cap',
		'twitter_followers',
		'commit_count_4_weeks',
		'alexa_rank',
		'bing_matches',
	],
	attribution: Attribution,
	includeUnknownProperties: false,
})
const CoinDetailsSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description:
				'CoinGecko Identifier for the Coin, e.g. `1x-short-bitcoin-token`',
			required: true,
			...stringSchema,
		},
		when: {
			description: 'Date of this data',
			required: true,
			...datetimeStringSchema,
		},
		coin: CoinSchema,
		market: CoinMarketSchema,
		categories: {
			description: 'CoinGecko Category Identifiers',
			required: true,
			type: coda.ValueType.Array,
			items: {
				type: coda.ValueType.String,
				required: true,
			},
		},
		block_time_in_minutes: {
			description: 'Block Time in Minutes',
			required: false,
			...minutesSchema,
		},
		coingecko_rank: {
			required: true,
			...numberSchema,
		},
		coingecko_score: {
			required: true,
			...numberSchema,
		},
		community_score: {
			required: true,
			...numberSchema,
		},
		country_origin: {
			required: true,
			...stringSchema,
		},
		description: {
			required: true,
			...stringSchema,
		},
		developer_score: {
			required: true,
			...numberSchema,
		},
		genesis_date: {
			required: true,
			...datetimeStringSchema,
		},
		hashing_algorithm: {
			required: true,
			...stringSchema,
		},
		liquidity_score: {
			required: true,
			...numberSchema,
		},
		market_cap_rank: {
			required: true,
			...numberSchema,
		},
		public_interest_score: {
			required: true,
			...numberSchema,
		},
		sentiment_votes_down_percentage: {
			required: true,
			...percentSchema,
		},
		sentiment_votes_up_percentage: {
			required: true,
			...percentSchema,
		},
		// urls
		homepage: linkSchema,
		blockchain_site: linkSchema,
		official_forum_url: linkSchema,
		chat_url: linkSchema,
		announcement_url: linkSchema,
		twitter_screen_name: {
			required: false,
			...stringSchema,
		},
		facebook_username: {
			required: false,
			...stringSchema,
		},
		bitcointalk_thread_identifier: {
			required: false,
			...stringSchema,
		},
		telegram_channel_identifier: {
			required: false,
			...stringSchema,
		},
		subreddit_url: {
			required: false,
			...stringSchema,
		},
		// repo urls
		github: linkSchema,
		bitbucket: linkSchema,
	},
	identity: {
		name: 'CoinDetails',
	},
	idProperty: 'id',
	displayProperty: 'coin',
	// title, subtitle
	featuredProperties: [
		'id',
		'coin',
		'market',
		'description',
		'coingecko_rank',
		'coingecko_score',
	],
	attribution: Attribution,
	includeUnknownProperties: false,
})

// ====================================
// CODA PARAMS

const CoinSearchParam = coda.makeParameter({
	name: 'Coin Search',
	description:
		'Searches for coins that match the search query, if not search query is provided, will fetch the trending coins.',
	type: coda.ParameterType.String,
	suggestedValue: 'Bitcoin',
	optional: false,
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

// ====================================
// FETCHERS

// async function bindFormulasForSyncTables<P, R>(
// 	formula: (
// 		params: P,
// 		context: coda.SyncExecutionContext | coda.ExecutionContext
// 	) => R
// ) {
// 	return async (params: P, context: coda.SyncExecutionContext) => {
// 		const result = await formula(params, context)
// 		return { result }
// 	}
// }

async function getDefiMarket(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url =
		'https://api.coingecko.com/api/v3/global/decentralized_finance_defi'
	const response = await context.fetcher.fetch<DefiMarketResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const result = response.body.data
	const market: DefiMarket = {
		volume_24h_usd: Number(result.trading_volume_24h),
		market_cap_usd: Number(result.defi_market_cap),
		defi_dominance: Number(result.defi_dominance) / 100,
	}
	return market
}

async function getGlobalMarket(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = 'https://api.coingecko.com/api/v3/global'
	const response = await context.fetcher.fetch<GlobalMarketResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const result = response.body.data
	const market: GlobalMarket = {
		active_cryptocurrencies: result.active_cryptocurrencies,
		upcoming_icos: result.upcoming_icos,
		ongoing_icos: result.ongoing_icos,
		ended_icos: result.ended_icos,
		markets: result.markets,
		volume_usd: result.total_volume.usd,
		market_cap_usd: result.total_market_cap.usd,
		market_cap_24h_percent: result.market_cap_change_percentage_24h_usd / 100,
		market_ratios: {
			btc: result.market_cap_percentage.btc / 100,
			eth: result.market_cap_percentage.eth / 100,
			usdt: result.market_cap_percentage.usdt / 100,
			usdc: result.market_cap_percentage.usdc / 100,
			bnb: result.market_cap_percentage.bnb / 100,
			xrp: result.market_cap_percentage.xrp / 100,
			busd: result.market_cap_percentage.busd / 100,
			ada: result.market_cap_percentage.ada / 100,
			sol: result.market_cap_percentage.sol / 100,
			dot: result.market_cap_percentage.dot / 100,
		},
		updated_at: result.updated_at,
	}
	return market
}

async function getCategories(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = 'https://api.coingecko.com/api/v3/coins/categories'
	const response = await context.fetcher.fetch<CategoriesResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: day,
	})
	const categories: Array<Category> = response.body.map((category) => ({
		id: category.id,
		name: category.name,
		description: category.content,
		volume_24h_usd: category.volume_24h,
		market_cap_usd: category.market_cap,
		market_cap_24h_percent: category.market_cap_change_24h / 100,
		updated_at: category.updated_at,
	}))
	return categories
}

async function getExchangeRates(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = 'https://api.coingecko.com/api/v3/exchange_rates'
	const response = await context.fetcher.fetch<ExchangeRatesResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const rates: Array<ExchangeRate> = []
	for (const key of Object.keys(response.body.rates)) {
		const rateResponse = response.body.rates[key]
		const rate: ExchangeRate = {
			id: key,
			name: rateResponse.name,
			unit: rateResponse.unit,
			value: rateResponse.value,
			type: rateResponse.type,
		}
		rates.push(rate)
	}
	return rates
}

function getCoinGeckoDateString(when: Date) {
	return `${when.getDate()}-${when.getMonth() + 1}-${when.getFullYear()}`
}

async function getCurrencies(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
	const response = await context.fetcher.fetch<Currencies>({
		method: 'GET',
		url: url,
		cacheTtlSecs: day,
	})
	const result: Currencies = response.body
	return result
}

function parseDate(when: string, fallback = new Date()) {
	return when ? new Date(when) : fallback
}

async function getCoinMarket(
	[input, when = new Date()]: [id: string, when?: Date],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const id = parseCoinIdentifier(input)
	const date = getCoinGeckoDateString(parseCoinWhen(input, when))
	const isToday = date === getCoinGeckoDateString(new Date())
	const url = coda.withQueryParams(
		`https://api.coingecko.com/api/v3/coins/${id}/history`,
		{
			date,
			localization: false,
		}
	)
	// console.log({ id, date, url })
	const response = await context.fetcher.fetch<CoinHistoryResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: isToday ? hour : day,
	})
	const result = response.body
	if (result.market_data == null) {
		if (isToday) {
			// try yesterday, as perhaps we live in the future
			return getCoinMarket(
				[id, new Date(when.getTime() - 24 * 60 * 60 * 1000)],
				context
			)
		} else {
			throw new coda.UserVisibleError(`Coin [${id}] returns no market data.`)
		}
	}
	const whenString = when.toISOString()
	const coin: CoinMarket = {
		id: `${result.id}@${whenString}`,
		when: whenString,
		coin: {
			id: result.id,
			symbol: result.symbol,
			name: result.name,
			url: getCoinUrl(result.id),
			image: result.image.large || result.image.small || result.image.thumb,
		},
		...(result.community_data || {}),
		...(result.developer_data || {}),
		price_usd: result.market_data?.current_price?.usd,
		price_btc: result.market_data?.current_price?.btc,
		volume_usd: result.market_data?.total_volume?.usd,
		volume_btc: result.market_data?.total_volume?.btc,
		market_cap_usd: result.market_data?.market_cap?.usd,
		market_cap_btc: result.market_data?.market_cap?.btc,
		// market
		price: result.market_data?.current_price,
		volume: result.market_data?.total_volume,
		market_cap: result.market_data?.market_cap,
		// public interest
		alexa_rank: result.public_interest_stats?.alexa_rank,
		bing_matches: result.public_interest_stats?.bing_matches,
	}
	return coin
}

async function getCoinDetails(
	[input]: [input: string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const id = parseCoinIdentifier(input)
	const url = coda.withQueryParams(
		`https://api.coingecko.com/api/v3/coins/${id}`,
		{
			market_data: true,
			community_data: true,
			developer_data: true,
			localization: false,
			sparkline: false,
			tickers: false,
		}
	)
	const response = await context.fetcher.fetch<CoinResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const result = response.body
	const coin = {
		id: result.id,
		symbol: result.symbol,
		name: result.name,
		url: getCoinUrl(result.id),
		image: result.image.large || result.image.small || result.image.thumb,
	}
	const whenString = parseDate(
		result.market_data?.last_updated,
		new Date()
	).toISOString()
	const details: CoinDetails = {
		id: result.id,
		when: result.last_updated,
		coin,
		market: {
			id: `${result.id}@${whenString}`,
			coin,
			when: result.market_data?.last_updated,
			...(result.community_data || {}),
			...(result.developer_data || {}),
			price_usd: result.market_data?.current_price?.usd,
			price_btc: result.market_data?.current_price?.btc,
			volume_usd: result.market_data?.total_volume?.usd,
			volume_btc: result.market_data?.total_volume?.btc,
			market_cap_usd: result.market_data?.market_cap?.usd,
			market_cap_btc: result.market_data?.market_cap?.btc,
			// market
			price: result.market_data?.current_price,
			volume: result.market_data?.total_volume,
			market_cap: result.market_data?.market_cap,
			// public interest
			alexa_rank: result.public_interest_stats?.alexa_rank,
			bing_matches: result.public_interest_stats?.bing_matches,
		},
		// fields
		block_time_in_minutes: result.block_time_in_minutes,
		coingecko_rank: result.coingecko_rank,
		coingecko_score: result.coingecko_score,
		community_score: result.community_score,
		country_origin: result.country_origin,
		description: result.description.en,
		developer_score: result.developer_score,
		genesis_date: result.genesis_date,
		hashing_algorithm: result.hashing_algorithm,
		liquidity_score: result.liquidity_score,
		market_cap_rank: result.market_cap_rank,
		public_interest_score: result.public_interest_score,
		sentiment_votes_down_percentage:
			result.sentiment_votes_down_percentage / 100,
		sentiment_votes_up_percentage: result.sentiment_votes_up_percentage / 100,
		// categories
		categories: result.categories,
		// links
		homepage: result.links.homepage,
		blockchain_site: result.links.blockchain_site,
		official_forum_url: result.links.official_forum_url,
		chat_url: result.links.chat_url,
		announcement_url: result.links.announcement_url,
		twitter_screen_name: result.links.twitter_screen_name,
		facebook_username: result.links.facebook_username,
		bitcointalk_thread_identifier: result.links.bitcointalk_thread_identifier,
		telegram_channel_identifier: result.links.telegram_channel_identifier,
		subreddit_url: result.links.subreddit_url,
		// repos
		github: result.links.repos_url.github,
		bitbucket: result.links.repos_url.bitbucket,
	}
	return details
}

// async function getCoinCurrency(
// 	[id, when = new Date(), currency = 'usd']: [
// 		id: string,
// 		currency?: string,
// 		when?: Date
// 	],
// 	context: coda.SyncExecutionContext | coda.ExecutionContext
// ) {
// 	const result = await getCoinMarket([id, when], context)
// 	const prices = result.market_data?.current_price
// 	if (!prices) {
// 		throw new coda.UserVisibleError(`Coin [${id}] returns no market data.`)
// 	}
// 	const price = prices[currency.toLowerCase()]
// 	if (!price) {
// 		const currencies = Object.keys(prices).sort().join(', ')
// 		throw new coda.UserVisibleError(
// 			`Invalid currency [${currency}]. Available currencies are: ${currencies}`
// 		)
// 	}
// 	return price
// }

async function getCoins(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = `https://api.coingecko.com/api/v3/coins/list`
	const response = await context.fetcher.fetch<CoinsListingResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const coins: Array<Coin> = response.body.map((result) => ({
		id: result.id,
		symbol: result.symbol,
		name: result.name,
		url: getCoinUrl(result.id),
	}))
	return coins
}

async function trendingCoins(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = `https://api.coingecko.com/api/v3/search/trending`
	const response = await context.fetcher.fetch<TrendingResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: hour,
	})
	const coins: Array<Coin> = response.body.coins.map((result) => ({
		id: result.item.id,
		symbol: result.item.symbol,
		name: result.item.name,
		url: getCoinUrl(result.item.id),
		image: result.item.large || result.item.small || result.item.thumb,
	}))
	return coins
}

async function searchCoins(
	[search]: [search: string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = coda.withQueryParams(`https://api.coingecko.com/api/v3/search`, {
		query: search,
	})
	const response = await context.fetcher.fetch<SearchResponse>({
		method: 'GET',
		url: url,
		cacheTtlSecs: day,
	})
	const coins: Array<Coin> = response.body.coins.map((result) => ({
		id: result.id,
		symbol: result.symbol,
		name: result.name,
		url: getCoinUrl(result.id),
		image: result.large || result.small || result.thumb,
	}))
	return coins
}

// ====================================
// CODA FORMULAS

// DefiMarket
pack.addFormula({
	name: 'GetDefiMarket',
	description: 'Fetch defi market data from CoinGecko.',
	resultType: coda.ValueType.Object,
	schema: DefiMarketSchema,
	parameters: [],
	execute: getDefiMarket,
})

// GlobalMarket
pack.addFormula({
	name: 'GetGlobalMarket',
	description: 'Fetch global market data from CoinGecko.',
	resultType: coda.ValueType.Object,
	schema: GlobalMarketSchema,
	parameters: [],
	execute: getGlobalMarket,
})

// Exchange Rates
pack.addFormula({
	name: 'GetCategories',
	description: 'Fetch categories from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [],
	execute: getCategories,
})

// Exchange Rates
pack.addFormula({
	name: 'GetBitcoinExchangeRates',
	description: 'Fetch exchange rates for Bitcoin from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: ExchangeRateSchema,
	parameters: [],
	execute: getExchangeRates,
})

// Currencies
pack.addFormula({
	name: 'GetCurrencies',
	description: 'Fetch currencies from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: CurrencySchema,
	parameters: [],
	execute: getCurrencies,
})

// Coin Currency
// pack.addFormula({
// 	name: 'GetCoinCurrency',
// 	description: 'Fetch historical currency price data for a coin identifier.',
// 	resultType: coda.ValueType.Number,
// 	schema: CoinCurrencySchema,
// 	parameters: [CoinIdParam, CurrencyParam, WhenParam],
// 	execute: getCoinCurrency,
// })

// Coin Market
pack.addFormula({
	name: 'GetCoinMarket',
	description:
		'Fetch market data for a coin identifier, including historical support.',
	resultType: coda.ValueType.Object,
	schema: CoinMarketSchema,
	parameters: [CoinIdParam, WhenParam],
	execute: getCoinMarket,
})

// Coin Details
pack.addFormula({
	name: 'GetCoinDetails',
	description: 'Fetch details for a coin identifier.',
	resultType: coda.ValueType.Object,
	schema: CoinDetailsSchema,
	parameters: [CoinIdParam],
	execute: getCoinDetails,
})

// Coins
pack.addFormula({
	name: 'GetCoins',
	description: 'Fetch minimal information for all coins.',
	resultType: coda.ValueType.Array,
	items: CoinSchema,
	parameters: [],
	execute: getCoins,
})

// Trending
pack.addFormula({
	name: 'TrendingCoins',
	description: 'Fetch information for coins that are trending.',
	resultType: coda.ValueType.Array,
	items: CoinSchema,
	parameters: [],
	execute: trendingCoins,
})

// Search
pack.addFormula({
	name: 'SearchCoins',
	description: 'Fetch information for coins that match the search query.',
	resultType: coda.ValueType.Array,
	items: CoinSchema,
	parameters: [CoinSearchParam],
	execute: searchCoins,
})

// ====================================
// CODA SYNC TABLES

// Categories
pack.addSyncTable({
	name: 'Categories',
	schema: CategorySchema,
	identityName: 'Category',
	formula: {
		name: 'SyncCategories',
		description: 'Sync categories from CoinGecko.',
		parameters: [],
		execute: async function ([], context) {
			const categories = await getCategories([], context)
			return { result: categories }
		},
	},
})

// Echange Rates
pack.addSyncTable({
	name: 'BitcoinExchangeRates',
	schema: ExchangeRateSchema,
	identityName: 'BitcoinExchangeRate',
	formula: {
		name: 'SyncExchangeRates',
		description: 'Sync bitcoin exchange rates from CoinGecko.',
		parameters: [],
		execute: async function ([], context) {
			const rates = await getExchangeRates([], context)
			return { result: rates }
		},
	},
})

// add the rest of the coingecko formulas/schemas
// and then consider what to do about sync tables
// where to have column formats with the extra details
// or whether to just have one coin schema with all the details

// Coins
pack.addSyncTable({
	name: 'Coins',
	schema: CoinSchema,
	identityName: 'Coin',
	formula: {
		name: 'SyncCoins',
		description: 'Sync coins from CoinGecko.',
		parameters: [CoinSearchParam],
		execute: async function ([search], context) {
			const coins = await searchCoins([search], context)
			return { result: coins }
		},
	},
})

// : await trendingCoins([], context)

// ====================================
// CODA COLUMN FORMATS

pack.addColumnFormat({
	name: 'CoinDetails',
	formulaName: 'GetCoinDetails',
})

pack.addColumnFormat({
	name: 'CoinMarket',
	formulaName: 'GetCoinMarket',
})
