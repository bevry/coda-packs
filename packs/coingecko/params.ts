import * as coda from '@codahq/packs-sdk'

export const CoinSearchParam = coda.makeParameter({
	name: 'Coin Search',
	description:
		'Searches for coins that match the search query, if not search query is provided, will fetch the trending coins.',
	type: coda.ParameterType.String,
	suggestedValue: 'Bitcoin',
	optional: false,
})

export const CoinInputParam = coda.makeParameter({
	name: 'Coin Identifier or URL or JSON',
	description:
		'Use `SearchCoins("query").First().id` to discover the Coin Identifier',
	type: coda.ParameterType.String,
	suggestedValue: 'bitcoin',
})

export const CurrencyParam = coda.makeParameter({
	name: 'Currency Identifier',
	description: 'Use `GetCurrencies` to get a list of supported currencies',
	type: coda.ParameterType.String,
	suggestedValue: 'usd',
	optional: true,
})

export const WhenParam = coda.makeParameter({
	name: 'When',
	description: 'The date to fetch historical data for.',
	type: coda.ParameterType.Date,
	optional: true,
})
