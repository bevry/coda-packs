import * as coda from '@codahq/packs-sdk'
import { AttributionNode } from '@codahq/packs-sdk'

import {
	usdSchema,
	currencySchema,
	percentSchema,
	minutesSchema,
	stringSchema,
	numberSchema,
	datetimeStringSchema,
	datetimeNumberSchema,
	urlSchema,
	imageSchema,
	linkSchema,
	booleanSchema,
} from '../shared/schemas'

export const Attribution: AttributionNode[] = [
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

// Defi Market
export const DefiMarketSchema = coda.makeObjectSchema({
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
export const CurrencyComparisonSchema = coda.makeObjectSchema({
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
export const GlobalMarketRatiosSchema = coda.makeObjectSchema({
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
export const GlobalMarketSchema = coda.makeObjectSchema({
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
export const CategorySchema = coda.makeObjectSchema({
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
export const ExchangeRateSchema = coda.makeObjectSchema({
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
export const CurrencySchema = coda.makeSchema({
	...stringSchema,
})

// Coin Currency
// const CoinCurrencySchema = coda.makeSchema({
// 	...currencySchema,
// })

// Coin
export const CoinSchema = coda.makeObjectSchema({
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

export const CoinMarketSchema = coda.makeObjectSchema({
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

export const CoinDetailsSchema = coda.makeObjectSchema({
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

// const CoinReferenceSchema = coda.makeReferenceSchemaFromObjectSchema(
// 	CoinSchema,
// 	'Coin'
// )
