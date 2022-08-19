export type Currencies = Array<string>

// type Missing = undefined | null

interface ExchangeRateResponse {
	name: string
	unit: string
	value: number
	type: string // 'crypto' | 'fiat'
}

export interface ExchangeRate extends ExchangeRateResponse {
	id: string
}

export interface ExchangeRatesResponse {
	rates: Record<string, ExchangeRateResponse>
}

export interface Coin {
	id: string
	symbol: string
	name: string
	url: string
	image?: string
}

export interface CoinMarket
	extends Partial<CommunityData>,
		Partial<DeveloperData> {
	id: string
	json: string
	when: string
	coin: Coin

	// historical and detailed
	price?: CurrencyComparisons
	volume?: CurrencyComparisons
	market_cap?: CurrencyComparisons

	// public interest
	alexa_rank?: number
	bing_matches?: number

	// manual
	price_usd?: number
	price_btc?: number
	volume_usd?: number
	volume_btc?: number
	market_cap_usd?: number
	market_cap_btc?: number
}
export interface CoinDetails extends Partial<Links>, Partial<Repos> {
	id: string
	json: string
	when: string // last_updated
	coin: Coin
	market: CoinMarket

	// detailed response
	categories: Array<string>
	description?: string // Description
	block_time_in_minutes?: number
	coingecko_rank?: number
	coingecko_score?: number
	community_score?: number
	country_origin?: string
	developer_score?: number
	genesis_date?: string // iso
	hashing_algorithm?: string
	liquidity_score?: number
	market_cap_rank?: number
	public_interest_score?: number
	sentiment_votes_down_percentage?: number
	sentiment_votes_up_percentage?: number
}

export interface CoinListingResponse {
	id: string
	symbol: string
	name: string
}
export type CoinsListingResponse = Array<CoinListingResponse>

interface CoinSearchResponse {
	id: string
	name: string
	symbol: string
	market_cap_rank?: number
	large?: string
	small?: string
	thumb?: string
}

interface CoinTrendingResponse extends CoinSearchResponse {
	slug: string
	price_btc: number
	score: number
}

export interface TrendingResponse {
	coins?: Array<{
		item: CoinTrendingResponse
	}>
	exchanges?: []
}

export interface SearchResponse {
	coins?: Array<CoinSearchResponse>
	exchanges?: []
	icos?: []
	categories?: Array<CategorySearchResponse>
	nfts?: Array<NftSearchResponse>
}

export interface CoinHistoryResponse {
	id: string
	name: string
	symbol: string
	image: Image
	// may not exist if the coin is not popular enough
	market_data?: MarketData
	community_data?: CommunityData
	developer_data?: DeveloperData
	public_interest_stats?: PublicInterestStats
	// different from detailed
	localization: Record<string, string>
}

export interface CoinResponse {
	id: string
	name: string
	symbol: string
	image: Image
	public_interest_stats: PublicInterestStats
	// different from historical
	last_updated: string
	block_time_in_minutes: number
	categories?: Array<string>
	coingecko_rank: number
	coingecko_score: number
	community_score: number
	country_origin: string
	description?: Description
	developer_score: number
	genesis_date: string
	hashing_algorithm: string
	links: LinksResponse
	liquidity_score: number
	market_cap_rank: number
	public_interest_score: number
	sentiment_votes_down_percentage: number
	sentiment_votes_up_percentage: number
	// required query params to enable
	market_data?: MarketDataDetailed
	community_data?: CommunityData
	developer_data?: DeveloperData
	// different from historical
	additional_notices?: []
	asset_platform_id?: unknown
	platforms: Platforms
	public_notice?: unknown
	status_updates?: []
	tickers?: Array<TickersEntity>
}

interface MarketData {
	current_price: CurrencyComparisons
	market_cap: CurrencyComparisons
	total_volume: CurrencyComparisons
}

interface MarketDataDetailed extends MarketData {
	total_value_locked?: unknown
	mcap_to_tvl_ratio?: unknown
	fdv_to_tvl_ratio?: unknown
	roi?: unknown
	ath: CurrencyComparisons
	ath_change_percentage: CurrencyComparisons
	ath_date: CurrencyDates
	atl: CurrencyComparisons
	atl_change_percentage: CurrencyComparisons
	atl_date: CurrencyDates
	market_cap_rank: number
	fully_diluted_valuation: CurrencyComparisons
	high_24h: CurrencyComparisons
	low_24h: CurrencyComparisons
	price_change_24h: number
	price_change_percentage_24h: number
	price_change_percentage_7d: number
	price_change_percentage_14d: number
	price_change_percentage_30d: number
	price_change_percentage_60d: number
	price_change_percentage_200d: number
	price_change_percentage_1y: number
	market_cap_change_24h: number
	market_cap_change_percentage_24h: number
	price_change_24h_in_currency: CurrencyComparisons
	price_change_percentage_1h_in_currency: CurrencyComparisons
	price_change_percentage_24h_in_currency: CurrencyComparisons
	price_change_percentage_7d_in_currency: CurrencyComparisons
	price_change_percentage_14d_in_currency: CurrencyComparisons
	price_change_percentage_30d_in_currency: CurrencyComparisons
	price_change_percentage_60d_in_currency: CurrencyComparisons
	price_change_percentage_200d_in_currency: CurrencyComparisons
	price_change_percentage_1y_in_currency: CurrencyComparisons
	market_cap_change_24h_in_currency: CurrencyComparisons
	market_cap_change_percentage_24h_in_currency: CurrencyComparisons
	total_supply: number
	max_supply: number
	circulating_supply: number
	sparkline_7d: Sparkline7d
	/** iso string */
	last_updated: string
}

interface CategorySearchResponse {
	id: number
	name: string
}

interface NftSearchResponse {
	id?: string
	name: string
	symbol: string
	large?: string
	small?: string
	thumb?: string
}

interface Platforms {
	[key: string]: string
}

interface Description {
	[key: string]: string
}

interface Links {
	homepage?: Array<string>
	blockchain_site?: Array<string>
	official_forum_url?: Array<string>
	chat_url?: Array<string>
	announcement_url?: Array<string>
	twitter_screen_name?: string
	facebook_username?: string
	bitcointalk_thread_identifier?: string
	telegram_channel_identifier?: string
	subreddit_url?: string
}
interface LinksResponse extends Links {
	repos_url: Repos
}

interface Repos {
	github?: Array<string>
	bitbucket?: []
}

interface Image {
	large?: string
	small?: string
	thumb?: string
}

interface CurrencyDates {
	// https://api.coingecko.com/api/v3/simple/supported_vs_currencies
	[currency: string]: string
	btc: string
	eth: string
	ltc: string
	bch: string
	bnb: string
	eos: string
	xrp: string
	xlm: string
	link: string
	dot: string
	yfi: string
	usd: string // USD
	aed: string
	ars: string
	aud: string
	bdt: string
	bhd: string
	bmd: string
	brl: string
	cad: string
	chf: string
	clp: string
	cny: string
	czk: string
	dkk: string
	eur: string
	gbp: string
	hkd: string
	huf: string
	idr: string
	ils: string
	inr: string
	jpy: string
	krw: string
	kwd: string
	lkr: string
	mmk: string
	mxn: string
	myr: string
	ngn: string
	nok: string
	nzd: string
	php: string
	pkr: string
	pln: string
	rub: string
	sar: string
	sek: string
	sgd: string
	thb: string
	try: string
	twd: string
	uah: string
	vef: string
	vnd: string
	zar: string
	xdr: string
	xag: string
	xau: string
	bits: string
	sats: string
}

interface CurrencyComparisons {
	// https://api.coingecko.com/api/v3/simple/supported_vs_currencies
	[currency: string]: number
	btc: number
	eth: number
	ltc: number
	bch: number
	bnb: number
	eos: number
	xrp: number
	xlm: number
	link: number
	dot: number
	yfi: number
	usd: number // USD
	aed: number
	ars: number
	aud: number
	bdt: number
	bhd: number
	bmd: number
	brl: number
	cad: number
	chf: number
	clp: number
	cny: number
	czk: number
	dkk: number
	eur: number
	gbp: number
	hkd: number
	huf: number
	idr: number
	ils: number
	inr: number
	jpy: number
	krw: number
	kwd: number
	lkr: number
	mmk: number
	mxn: number
	myr: number
	ngn: number
	nok: number
	nzd: number
	php: number
	pkr: number
	pln: number
	rub: number
	sar: number
	sek: number
	sgd: number
	thb: number
	try: number
	twd: number
	uah: number
	vef: number
	vnd: number
	zar: number
	xdr: number
	xag: number
	xau: number
	bits: number
	sats: number
}

interface Sparkline7d {
	price?: Array<number>
}

interface CommunityData {
	// even doing ? here to mark it as optional, does not fix the type error, so seems it is nested object schemas are disregarding `required: false`
	facebook_likes?: number
	twitter_followers?: number
	reddit_average_posts_48h?: number
	reddit_average_comments_48h?: number
	reddit_subscribers?: number
	reddit_accounts_active_48h?: number
	telegram_channel_user_count?: number
}

interface DeveloperData {
	forks?: number
	stars?: number
	subscribers?: number
	total_issues?: number
	closed_issues?: number
	pull_requests_merged?: number
	pull_request_contributors?: number
	commit_count_4_weeks?: number
	last_4_weeks_commit_activity_series?: Array<number>
	code_additions_deletions_4_weeks?: CodeAdditionsDeletions4Weeks
}

interface CodeAdditionsDeletions4Weeks {
	additions?: number
	deletions?: number
}

interface PublicInterestStats {
	alexa_rank?: number
	bing_matches?: number
}

interface TickersEntity {
	base: string
	target: string
	market: Market
	last: number
	volume: number
	converted_last: ConvertedLastOrConvertedVolume
	converted_volume: ConvertedLastOrConvertedVolume
	trust_score: string
	bid_ask_spread_percentage: number
	timestamp: string
	last_traded_at: string
	last_fetch_at: string
	is_anomaly: boolean
	is_stale: boolean
	trade_url?: string
	token_info_url: null
	coin_id: string
	target_coin_id?: string
}

interface Market {
	name: string
	identifier: string
	has_trading_incentive: boolean
}

interface ConvertedLastOrConvertedVolume {
	btc: number
	eth: number
	usd: number
}

export interface Category {
	id: string
	name: string
	description: string
	volume_24h_usd: number
	market_cap_usd: number
	market_cap_24h_percent: number
	updated_at: string
}

interface CategoryResponse {
	id: string
	name: string
	market_cap: number
	market_cap_change_24h: number
	volume_24h: number
	/** iso date string */
	updated_at: string
	/** lengthy description */
	content: string
	/** images of top three coins */
	top_3_coins: Array<string>
}

export type CategoriesResponse = Array<CategoryResponse>

export interface MarketRatios {
	btc: number
	eth: number
	usdt: number
	usdc: number
	bnb: number
	xrp: number
	busd: number
	ada: number
	sol: number
	dot: number
}
export interface GlobalMarket {
	active_cryptocurrencies: number
	upcoming_icos: number
	ongoing_icos: number
	ended_icos: number
	markets: number
	volume_usd: number
	market_cap_usd: number
	market_cap_24h_percent: number
	market_ratios: MarketRatios
	updated_at: number
}

export interface GlobalMarketResponse {
	data: {
		active_cryptocurrencies: number
		upcoming_icos: number
		ongoing_icos: number
		ended_icos: number
		markets: number
		market_cap_change_percentage_24h_usd: number
		updated_at: number
		/** market cap */
		total_market_cap: CurrencyComparisons
		/** volume in currencies, not sure why it is measured this way, and what is the duration of the volume? */
		total_volume: CurrencyComparisons
		/** percentage of dominance */
		market_cap_percentage: MarketRatios
	}
}

export interface DefiMarket {
	volume_24h_usd: number
	market_cap_usd: number
	defi_dominance: number
}

export interface DefiMarketResponse {
	data: {
		defi_market_cap: string
		eth_market_cap: string
		defi_to_eth_ratio: string
		trading_volume_24h: string
		// percentage
		defi_dominance: string
		top_coin_name: string
		// percentage
		top_coin_defi_dominance: string
	}
}
