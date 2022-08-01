export type Currencies = Array<string>

interface RawCoin {
	id: string
	symbol: string
	name: string
}
export type CoinsResponse = Array<RawCoin>

export interface Coin extends RawCoin {
	url: string
}

export interface CoinDetails extends Coin {}

export interface CoinHistoricalResponse extends Coin {
	image: Image
	community_data: CommunityData
	developer_data: DeveloperData
	localization: Record<string, string>
	market_data: {
		current_price: CurrencyComparisons
		market_cap: CurrencyComparisons
		total_volume: CurrencyComparisons
	}
	public_interest_stats: PublicInterestStats
}

export interface CoinBaseReponse extends Coin {
	image: Image
	block_time_in_minutes: number
	categories: Array<string> | null
	coingecko_rank: number
	coingecko_score: number
	community_score: number
	country_origin: string
	description: Description
	developer_score: number
	genesis_date: string
	hashing_algorithm: string
	last_updated: string
	links: Links
	liquidity_score: number
	market_cap_rank: number
	public_interest_score: number
	public_interest_stats: PublicInterestStats
	sentiment_votes_down_percentage: number
	sentiment_votes_up_percentage: number
}

export interface CoinMarketReponse extends CoinBaseReponse {
	additional_notices: [] | null
	asset_platform_id: null
	block_time_in_minutes: number
	categories: Array<string> | null
	community_data: CommunityData
	description: Description
	developer_data: DeveloperData
	market_data: MarketData
	platforms: Platforms
	public_notice: null
	status_updates: [] | null
	tickers: Array<TickersEntity> | null
}

interface Platforms {
	[key: string]: string
}
interface Description {
	en: string
}
interface Links {
	homepage: Array<string> | null
	blockchain_site: Array<string> | null
	official_forum_url: Array<string> | null
	chat_url: Array<string> | null
	announcement_url: Array<string> | null
	twitter_screen_name: string
	facebook_username: string
	bitcointalk_thread_identifier: null
	telegram_channel_identifier: string
	subreddit_url: string
	repos_url: ReposUrl
}
interface ReposUrl {
	github: Array<string> | null
	bitbucket: [] | null
}
interface Image {
	thumb: string
	small: string
	large?: string
}
interface MarketData {
	current_price: CurrencyComparisons
	total_value_locked: null
	mcap_to_tvl_ratio: null
	fdv_to_tvl_ratio: null
	roi: null
	ath: CurrencyComparisons
	ath_change_percentage: CurrencyComparisons
	ath_date: CurrencyDates
	atl: CurrencyComparisons
	atl_change_percentage: CurrencyComparisons
	atl_date: CurrencyDates
	market_cap: CurrencyComparisons
	market_cap_rank: number
	fully_diluted_valuation: CurrencyComparisons
	total_volume: CurrencyComparisons
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
	last_updated: string
}
interface CurrencyDates {
	[currency: string]: string
	usd: string
}
interface CurrencyComparisons {
	[currency: string]: number
	usd: number
}
interface Sparkline7d {
	price: null | Array<number>
}
interface CommunityData {
	facebook_likes: null | number
	twitter_followers: null | number
	reddit_average_posts_48h: null | number
	reddit_average_comments_48h: null | number
	reddit_subscribers: null | number
	reddit_accounts_active_48h: null | number
	telegram_channel_user_count: null | number
}
interface DeveloperData {
	forks: null | number
	stars: null | number
	subscribers: null | number
	total_issues: null | number
	closed_issues: null | number
	pull_requests_merged: null | number
	pull_request_contributors: null | number
	code_additions_deletions_4_weeks: CodeAdditionsDeletions4Weeks
	commit_count_4_weeks: null | number
	last_4_weeks_commit_activity_series: null | Array<number>
}
interface CodeAdditionsDeletions4Weeks {
	additions: null | number
	deletions: null | number
}
interface PublicInterestStats {
	alexa_rank: null | number
	bing_matches: null | number
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
	trade_url: null | string
	token_info_url: null
	coin_id: string
	target_coin_id: null | string
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
