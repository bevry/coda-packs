import * as coda from '@codahq/packs-sdk'

export const CoinSearchParam = coda.makeParameter({
	name: 'Coin Search',
	description:
		'Searches for coins that match the search query, if not search query is provided, will fetch the trending coins.',
	type: coda.ParameterType.String,
	suggestedValue: 'Bitcoin',
	optional: false,
})

export const CoinIdParam = coda.makeParameter({
	name: 'Coin ID',
	description:
		'Use `Coins` sync table to get a list of supported coins, otherwise use the URL: https://coingecko.com/coins/<identifier>',
	type: coda.ParameterType.String,
	suggestedValue: 'bitcoin',
})

export const CurrencyParam = coda.makeParameter({
	name: 'Currency ID',
	description: 'Use `GetCurrencies` to get a list of supported currencies',
	type: coda.ParameterType.String,
	suggestedValue: 'usd',
	optional: true,
})

export const WhenParam = coda.makeParameter({
	name: 'When',
	description: 'The date identifier: <dd-mm-yyyy>, eg. 30-12-2017',
	type: coda.ParameterType.Date,
	optional: true,
})
