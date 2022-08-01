pack.addFormula({
	name: 'GetCoin',
	description: 'Fetch data for a coin identifier.',
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
		const response = await context.fetcher.fetch<CoinMarketReponse>({
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

// Coin details fetch
pack.addFormula({
	name: 'GetCoinMarket',
	description: 'Fetch current coin details for a coin identifier.',
	resultType: coda.ValueType.Object,
	schema: CoinMarketSchema,
	parameters: [CoinIdParam],
	execute: async function ([input], context) {
		const id = parseCoinIdentifier(input)
		const url = coda.withQueryParams(
			`https://api.coingecko.com/api/v3/coins/${id}`,
			{
				market_data: true,
				localization: false,
				tickers: true,
				community_data: true,
				developer_data: true,
				sparkline: true,
			}
		)
		const response = await context.fetcher.fetch<CoinMarketReponse>({
			method: 'GET',
			url: url,
		})
		const result = addCoinUrl(response.body)
		return result
	},
})
