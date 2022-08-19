import * as coda from '@codahq/packs-sdk'

import {
	getCategories,
	getCoinDetails,
	getCoinMarket,
	getCoins,
	getCurrencies,
	getDefiMarket,
	getExchangeRates,
	getGlobalMarket,
	searchCoins,
	trendingCoins,
} from './api'

import {
	CategorySchema,
	CoinDetailsSchema,
	CoinMarketSchema,
	CoinSchema,
	CurrencySchema,
	DefiMarketSchema,
	ExchangeRateSchema,
	GlobalMarketSchema,
} from './schemas'

import { CoinInputParam, CoinSearchParam, WhenParam } from './params'

// ====================================
// CODA PACK

// https://www.coingecko.com/en/api/documentation
export const pack = coda.newPack()
pack.addNetworkDomain('api.coingecko.com')
// pack.setUserAuthentication({
// 	type: coda.AuthenticationType.HeaderBearerToken,
// 	instructionsUrl: 'https://www.coingecko.com/en/api/pricing',
// 	defaultConnectionRequirement: coda.ConnectionRequirement.Optional,
// })

// ====================================
// DEFI MARKET

pack.addFormula({
	name: 'GetDefiMarket',
	description: 'Fetch defi market data from CoinGecko.',
	resultType: coda.ValueType.Object,
	schema: DefiMarketSchema,
	parameters: [],
	execute: getDefiMarket,
})

// ====================================
// GLOBAL MARKET

pack.addFormula({
	name: 'GetGlobalMarket',
	description: 'Fetch global market data from CoinGecko.',
	resultType: coda.ValueType.Object,
	schema: GlobalMarketSchema,
	parameters: [],
	execute: getGlobalMarket,
})

// ====================================
// CATEGORIES

pack.addFormula({
	name: 'GetCategories',
	description: 'Fetch categories from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [],
	execute: getCategories,
})

// ====================================
// EXCHANGE RATES

pack.addFormula({
	name: 'GetBitcoinExchangeRates',
	description: 'Fetch exchange rates for Bitcoin from CoinGecko.',
	resultType: coda.ValueType.Array,
	items: ExchangeRateSchema,
	parameters: [],
	execute: getExchangeRates,
})

// ====================================
// CURRENCIES

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

// ====================================
// COIN MARKET

pack.addFormula({
	name: 'GetCoinMarket',
	description:
		'Fetch market data for a coin identifier, including historical support.',
	resultType: coda.ValueType.Object,
	schema: CoinMarketSchema,
	parameters: [CoinInputParam, WhenParam],
	execute: getCoinMarket,
})

// ====================================
// COIN DETAILS

pack.addFormula({
	name: 'GetCoinDetails',
	description: 'Fetch details for a coin identifier.',
	resultType: coda.ValueType.Object,
	schema: CoinDetailsSchema,
	parameters: [CoinInputParam],
	execute: getCoinDetails,
})

// ====================================
// COINS

pack.addFormula({
	name: 'GetCoins',
	description: 'Fetch minimal information for all coins.',
	resultType: coda.ValueType.Array,
	items: CoinSchema,
	parameters: [],
	execute: getCoins,
})

// ====================================
// TRENDING COINS

pack.addFormula({
	name: 'TrendingCoins',
	description: 'Fetch information for coins that are trending.',
	resultType: coda.ValueType.Array,
	items: CoinSchema,
	parameters: [],
	execute: trendingCoins,
})

// ====================================
// SEARCH COINS

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

// Exchange Rates
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
