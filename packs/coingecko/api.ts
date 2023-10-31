import * as coda from '@codahq/packs-sdk'

import type {
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
	ErrorResponse,
	ExchangeRate,
	ExchangeRatesResponse,
	GlobalMarket,
	GlobalMarketResponse,
	SearchResponse,
	TrendingResponse,
} from './types'

export const minute = 60
export const hour = minute * 60
export const day = hour * 24
export const longTime = day * 7

// ====================================
// HELPERS

async function fetch<T>(
	request: coda.FetchRequest,
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	try {
		return await context.fetcher.fetch<T>(request)
	} catch (rawError: any) {
		if (rawError.statusCode) {
			const error = rawError as coda.StatusCodeError
			const coinGeckoErrorCode = error.body?.status?.error_code
			const coinGeckoErrorMessage = error.body?.status?.error_message
			if (coinGeckoErrorCode === 429) {
				throw new coda.UserVisibleError(
					`Rate limits exceeded: https://coda.io/@balupton/coingecko/rate-limits-14`,
				)
			}
			throw new coda.UserVisibleError(
				coinGeckoErrorMessage ||
					`Required failed with error ${error.statusCode}`,
			)
		}
		throw new coda.UserVisibleError('Request failed.')
	}
}

// ------------------------------------
// Dates

function getCoinGeckoDate(input: null | string | number | Date = new Date()) {
	const when = !input
		? new Date()
		: typeof input === 'string' || typeof input === 'number'
		? new Date(input)
		: input
	when.setMilliseconds(0)
	when.setSeconds(0)
	when.setMinutes(0)
	return when
}

function getCoinGeckoDateString(when = new Date()) {
	return `${when.getDate()}-${when.getMonth() + 1}-${when.getFullYear()}`
}

function isToday(when: Date) {
	return getCoinGeckoDateString(when) === getCoinGeckoDateString()
}

function getYesterday(when = new Date()) {
	return getCoinGeckoDate(when.getTime() - 24 * 60 * 60 * 1000)
}

// ------------------------------------
// Identifiers

function getCoinUrl(id: string) {
	return `https://coingecko.com/coins/${id}`
}

function getCoinWhenFromInput(identifier: string): Date {
	const match = identifier.match('^.+?@(.+)$')
	return getCoinGeckoDate(match && match[1])
}

function getCoinIdFromInput(input: string): string {
	if (input.startsWith('http')) {
		const match = input.match(
			'^https?://.*?coingecko.com/.*?coins/(.+?)(@.+)?$',
		)
		return ((match && match[1]) || input).toLowerCase()
	} else {
		const match = input.match('^(.+?)(@.+)?$')
		return ((match && match[1]) || input).toLocaleLowerCase()
	}
}

function parseInput(input: string) {
	if (input.startsWith('{')) {
		try {
			const data = JSON.parse(input)
			if (data?.codaSchemaIdentity === 'CoinDetails') {
				const coinDetails = data as CoinDetails
				const coinMarket: CoinMarket = coinDetails.market
				return {
					id: getCoinIdFromInput(coinMarket.id),
					when: coinMarket.when,
					coinDetails,
					coinMarket,
				}
			} else if (data?.codaSchemaIdentity === 'CoinMarket') {
				const coinMarket = data as CoinMarket
				return {
					id: getCoinIdFromInput(coinMarket.id),
					when: coinMarket.when,
					coinMarket,
				}
			}
		} catch (error) {}
	} else {
		return {
			id: getCoinIdFromInput(input),
			when: getCoinWhenFromInput(input),
		}
	}
	return {}
}

// ------------------------------------
// Parsing

function parseCoin(rawCoin: {
	id: string
	symbol: string
	name: string
	image?: {
		large?: string
		small?: string
		thumb?: string
	}
}): Coin {
	return {
		id: rawCoin.id,
		symbol: rawCoin.symbol,
		name: rawCoin.name,
		url: getCoinUrl(rawCoin.id),
		image:
			rawCoin.image?.large ||
			rawCoin.image?.small ||
			rawCoin.image?.thumb ||
			'',
	}
}

function parseCoins(
	rawCoins: SearchResponse['coins'] | CoinsListingResponse,
): Coin[] {
	return (rawCoins || []).map(parseCoin)
}

function parseTrendingCoins(trendingCoins: TrendingResponse['coins']): Coin[] {
	return (trendingCoins || []).map((result) => parseCoin(result.item))
}

function parseCoinMarket(
	result: CoinResponse | CoinHistoryResponse,
	when: Date,
): CoinMarket {
	// parse
	const whenString = when.toISOString()
	const coin = parseCoin(result)
	const coinMarket: CoinMarket = {
		// essential
		id: `${result.id}@${whenString}`,
		json: '',
		when: whenString,
		coin,

		// community data
		facebook_likes: result.community_data?.facebook_likes || undefined,
		twitter_followers: result.community_data?.twitter_followers || undefined,
		reddit_average_posts_48h:
			result.community_data?.reddit_average_posts_48h || undefined,
		reddit_average_comments_48h:
			result.community_data?.reddit_average_comments_48h || undefined,
		reddit_subscribers: result.community_data?.reddit_subscribers || undefined,
		reddit_accounts_active_48h:
			result.community_data?.reddit_accounts_active_48h || undefined,
		telegram_channel_user_count:
			result.community_data?.telegram_channel_user_count || undefined,

		// developer data
		forks: result.developer_data?.forks || undefined,
		stars: result.developer_data?.stars || undefined,
		subscribers: result.developer_data?.subscribers || undefined,
		total_issues: result.developer_data?.total_issues || undefined,
		closed_issues: result.developer_data?.closed_issues || undefined,
		pull_requests_merged:
			result.developer_data?.pull_requests_merged || undefined,
		pull_request_contributors:
			result.developer_data?.pull_request_contributors || undefined,
		commit_count_4_weeks:
			result.developer_data?.commit_count_4_weeks || undefined,
		// last_4_weeks_commit_additions:
		// 	result.developer_data?.code_additions_deletions_4_weeks?.additions ||
		// 	null,
		// last_4_weeks_commit_deletions:
		// 	result.developer_data?.code_additions_deletions_4_weeks?.additions ||
		// 	null,

		// public interest
		alexa_rank: result.public_interest_stats?.alexa_rank || undefined,
		bing_matches: result.public_interest_stats?.bing_matches || undefined,

		// market data shortcuts
		price_usd: result.market_data?.current_price?.usd || undefined,
		price_btc: result.market_data?.current_price?.btc || undefined,
		volume_usd: result.market_data?.total_volume?.usd || undefined,
		volume_btc: result.market_data?.total_volume?.btc || undefined,
		market_cap_usd: result.market_data?.market_cap?.usd || undefined,
		market_cap_btc: result.market_data?.market_cap?.btc || undefined,

		// market data
		price: result.market_data?.current_price || undefined,
		volume: result.market_data?.total_volume || undefined,
		market_cap: result.market_data?.market_cap || undefined,
	}

	// return
	return coinMarket
}

function wrapCoinMarket(coinMarket: CoinMarket): CoinMarket {
	return {
		...coinMarket,
		json: JSON.stringify({
			...coinMarket,
			codaSchemaIdentity: 'CoinMarket',
		}),
	}
}

function parseCoinDetails(result: CoinResponse): CoinDetails {
	const when = getCoinGeckoDate(
		result.last_updated || result.market_data?.last_updated,
	)
	const whenString = when.toISOString()
	const coin = parseCoin(result)
	const coinMarket = parseCoinMarket(result, when)
	const coinDetails: CoinDetails = {
		id: result.id,
		json: '',
		when: whenString,
		coin,
		market: coinMarket,

		// fields
		description: result.description?.en,
		block_time_in_minutes: result.block_time_in_minutes,
		coingecko_rank: result.coingecko_rank,
		coingecko_score: result.coingecko_score,
		community_score: result.community_score,
		country_origin: result.country_origin,
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
		categories: result.categories || [],

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

	// return
	return coinDetails
}

function wrapCoinDetails(coinDetails: CoinDetails): CoinDetails {
	const market = wrapCoinMarket(coinDetails.market)
	return {
		...coinDetails,
		market,
		json: JSON.stringify({
			...coinDetails,
			market,
			codaSchemaIdentity: 'CoinDetails',
		}),
	}
}

function parseDefiMarket(
	rawDefiMarket: DefiMarketResponse['data'],
): DefiMarket {
	// parse
	const defiMarket: DefiMarket = {
		volume_24h_usd: Number(rawDefiMarket.trading_volume_24h),
		market_cap_usd: Number(rawDefiMarket.defi_market_cap),
		defi_dominance: Number(rawDefiMarket.defi_dominance) / 100,
	}

	// return
	return defiMarket
}
function parseGlobalMarket(
	rawGlobalMarket: GlobalMarketResponse['data'],
): GlobalMarket {
	// parse
	const globalMarket: GlobalMarket = {
		active_cryptocurrencies: rawGlobalMarket.active_cryptocurrencies,
		upcoming_icos: rawGlobalMarket.upcoming_icos,
		ongoing_icos: rawGlobalMarket.ongoing_icos,
		ended_icos: rawGlobalMarket.ended_icos,
		markets: rawGlobalMarket.markets,
		volume_usd: rawGlobalMarket.total_volume.usd,
		market_cap_usd: rawGlobalMarket.total_market_cap.usd,
		market_cap_24h_percent:
			rawGlobalMarket.market_cap_change_percentage_24h_usd / 100,
		market_ratios: {
			btc: rawGlobalMarket.market_cap_percentage.btc / 100,
			eth: rawGlobalMarket.market_cap_percentage.eth / 100,
			usdt: rawGlobalMarket.market_cap_percentage.usdt / 100,
			usdc: rawGlobalMarket.market_cap_percentage.usdc / 100,
			bnb: rawGlobalMarket.market_cap_percentage.bnb / 100,
			xrp: rawGlobalMarket.market_cap_percentage.xrp / 100,
			busd: rawGlobalMarket.market_cap_percentage.busd / 100,
			ada: rawGlobalMarket.market_cap_percentage.ada / 100,
			sol: rawGlobalMarket.market_cap_percentage.sol / 100,
			dot: rawGlobalMarket.market_cap_percentage.dot / 100,
		},
		updated_at: rawGlobalMarket.updated_at,
	}

	// return
	return globalMarket
}

function parseCategories(rawCategories: CategoriesResponse): Array<Category> {
	// parse
	const categories: Array<Category> = rawCategories.map((rawCategory) => ({
		id: rawCategory.id,
		name: rawCategory.name,
		description: rawCategory.content,
		volume_24h_usd: rawCategory.volume_24h,
		market_cap_usd: rawCategory.market_cap,
		market_cap_24h_percent: rawCategory.market_cap_change_24h / 100,
		updated_at: rawCategory.updated_at,
	}))

	// return
	return categories
}

function parseRates(
	rawRates: ExchangeRatesResponse['rates'],
): Array<ExchangeRate> {
	// parse
	const rates: Array<ExchangeRate> = []
	for (const key of Object.keys(rawRates)) {
		const rawRate = rawRates[key]
		const rate: ExchangeRate = {
			id: key,
			name: rawRate.name,
			unit: rawRate.unit,
			value: rawRate.value,
			type: rawRate.type,
		}
		rates.push(rate)
	}

	// return
	return rates
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
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url =
		'https://api.coingecko.com/api/v3/global/decentralized_finance_defi'
	const response = await fetch<DefiMarketResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to fetch defi market data.`)
	}

	// return
	const defiMarket = parseDefiMarket(response.body.data)
	return defiMarket
}

// ====================================
// GLOBAL MARKET

export async function getGlobalMarket(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url = 'https://api.coingecko.com/api/v3/global'
	const response = await fetch<GlobalMarketResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to fetch global market data.`)
	}

	// return
	const globalMarket = parseGlobalMarket(response.body.data)
	return globalMarket
}

// ====================================
// CATEGORIES

export async function getCategories(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url = 'https://api.coingecko.com/api/v3/coins/categories'
	const response = await fetch<CategoriesResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body) {
		throw new coda.UserVisibleError(`Failed to fetch categories.`)
	}

	// return
	const categories = parseCategories(response.body)
	return categories
}

// ====================================
// EXCHANGE RATES

export async function getExchangeRates(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
): Promise<Array<ExchangeRate>> {
	// fetch
	const url = 'https://api.coingecko.com/api/v3/exchange_rates'
	const response = await fetch<ExchangeRatesResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.rates) {
		throw new coda.UserVisibleError(`Failed to fetch exchange rates.`)
	}

	// return
	const rates = parseRates(response.body.rates)
	return rates
}

// ====================================
// CURRENCIES

export async function getCurrencies(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
): Promise<Currencies> {
	// fetch
	const url = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
	const response = await fetch<Currencies>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body) {
		throw new coda.UserVisibleError(`Failed to fetch currencies.`)
	}

	// return
	const currencies: Currencies = response.body
	return currencies
}

// ====================================
// COIN MARKET

export async function getCoinMarket(
	[input, inputWhen]: [id: string, when?: Date],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
): Promise<CoinMarket> {
	// prepare
	const request = parseInput(input)
	const when = getCoinGeckoDate(inputWhen || request.when)
	if (request.coinMarket?.when === when.toISOString()) {
		return wrapCoinMarket(request.coinMarket)
	}
	const wasToday = isToday(when)

	// check
	if (!request.id) {
		throw new coda.UserVisibleError(`A coin identifier must be provided`)
	}

	// fetch
	const query = {
		date: getCoinGeckoDateString(when),
		localization: false,
	}
	const url = coda.withQueryParams(
		`https://api.coingecko.com/api/v3/coins/${request.id}/history`,
		query,
	)
	const response = await fetch<CoinHistoryResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: wasToday ? day : longTime,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.market_data) {
		if (wasToday) {
			// try yesterday, as perhaps we live in the future
			return getCoinMarket([request.id, getYesterday(when)], context)
		} else {
			throw new coda.UserVisibleError(`Failed to fetch coin market data.`)
		}
	}

	// return
	const coinMarket = parseCoinMarket(response.body, when)
	return wrapCoinMarket(coinMarket)
}

// ====================================
// COIN DETAILS

export async function getCoinDetails(
	[input]: [input: string],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
): Promise<CoinDetails> {
	// prepare
	const request = parseInput(input)
	if (request.coinDetails) return wrapCoinDetails(request.coinDetails)

	// check
	if (!request.id) {
		throw new coda.UserVisibleError(`A coin identifier must be provided`)
	}

	// fetch
	const query = {
		market_data: true,
		community_data: true,
		developer_data: true,
		localization: false,
		sparkline: false,
		tickers: false,
	}
	const url = coda.withQueryParams(
		`https://api.coingecko.com/api/v3/coins/${request.id}`,
		query,
	)
	const response = await fetch<CoinResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body) {
		throw new coda.UserVisibleError(`Failed to fetch coin details.`)
	}

	// return
	const coinDetails = parseCoinDetails(response.body)
	return wrapCoinDetails(coinDetails)
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
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url = `https://api.coingecko.com/api/v3/coins/list`
	const response = await fetch<CoinsListingResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body) {
		throw new coda.UserVisibleError(`Failed to fetch coins.`)
	}

	// return
	const coins = parseCoins(response.body)
	return coins
}

// ====================================
// TRENDING COINS

export async function trendingCoins(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url = `https://api.coingecko.com/api/v3/search/trending`
	const response = await fetch<TrendingResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.coins) {
		throw new coda.UserVisibleError(`Failed to fetch trending coins.`)
	}

	// return
	const coins = parseTrendingCoins(response.body.coins)
	return coins
}

// ====================================
// SEARCH COINS

export async function searchCoins(
	[search]: [search: string],
	context: coda.SyncExecutionContext | coda.ExecutionContext,
) {
	// fetch
	const url = coda.withQueryParams(`https://api.coingecko.com/api/v3/search`, {
		query: search,
	})
	const response = await fetch<SearchResponse>(
		{
			method: 'GET',
			url: url,
			cacheTtlSecs: day,
		},
		context,
	)

	// verify
	if (!response.body || !response.body.coins) {
		throw new coda.UserVisibleError(`Failed to fetch searched coins.`)
	}

	// return
	const coins = parseCoins(response.body.coins)
	return coins
}
