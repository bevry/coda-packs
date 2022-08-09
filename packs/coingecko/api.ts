import * as coda from '@codahq/packs-sdk'
import { hour, day } from './config'
import {
	CategoriesResponse,
	Category,
	Coin,
	CoinDetails,
	CoinHistoryResponse,
	CoinMarket,
	CoinResponse,
	CoinsListingResponse,
	Currencies,
	DefiMarket,
	DefiMarketResponse,
	ExchangeRate,
	ExchangeRatesResponse,
	GlobalMarket,
	GlobalMarketResponse,
	SearchResponse,
	TrendingResponse,
} from './types'

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

function getCoinGeckoDateString(when: Date) {
	return `${when.getDate()}-${when.getMonth() + 1}-${when.getFullYear()}`
}
function parseDate(when: string, fallback = new Date()) {
	return when ? new Date(when) : fallback
}

// export async function bindFormulasForSyncTables<P, R>(
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

// ====================================
// DEFI MARKET

export async function getDefiMarket(
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

// ====================================
// GLOBAL MARKET

export async function getGlobalMarket(
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

// ====================================
// CATEGORIES

export async function getCategories(
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

// ====================================
// EXCHANGE RATES

export async function getExchangeRates(
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

// ====================================
// CURRENCIES

export async function getCurrencies(
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

// ====================================
// COIN MARKET

export async function getCoinMarket(
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

// ====================================
// COIN DETAILS

export async function getCoinDetails(
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
	const coin: Coin = {
		id: result.id,
		symbol: result.symbol,
		name: result.name,
		url: getCoinUrl(result.id),
		image: result.image.large || result.image.small || result.image.thumb || '',
	}
	const whenString = parseDate(
		result.market_data?.last_updated,
		new Date()
	).toISOString()
	const coinMarket: CoinMarket = {
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
	}
	const details: CoinDetails = {
		id: result.id,
		when: result.last_updated,
		coin,
		market: coinMarket,
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

// export async function getCoinCurrency(
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

// ====================================
// COINS

export async function getCoins(
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
		image: '',
	}))
	return coins
}

// ====================================
// TRENDING COINS

export async function trendingCoins(
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

// ====================================
// SEARCH COINS

export async function searchCoins(
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
