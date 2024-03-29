import * as coda from '@codahq/packs-sdk'
export const pack = coda.newPack()

pack.addNetworkDomain('hooks.zapier.com')

pack.addFormula({
	name: 'ZapierHook',
	description: 'Trigger a Zapier Hook',
	parameters: [
		coda.makeParameter({
			type: coda.ParameterType.String,
			name: 'url',
			description: 'The Webhook URL of the Zapier Zap',
		}),
		coda.makeParameter({
			type: coda.ParameterType.String,
			name: 'body',
			description: 'Body for a Zapier Catch Raw Hook',
			optional: true,
		}),
		coda.makeParameter({
			type: coda.ParameterType.StringArray,
			name: 'bodyParams',
			description:
				'Body Params in the form of List(key, value, ...) for a Zapier Catch Hook',
			optional: true,
		}),
		coda.makeParameter({
			type: coda.ParameterType.StringArray,
			name: 'queryParams',
			description:
				'Query/Search Params in the form of List(key, value, ...) for a Zapier Catch Hook',
			optional: true,
		}),
	],
	resultType: coda.ValueType.String,
	isAction: true,
	execute: async function (
		[where, body, bodyParamsList = [], queryParamsList = []],
		context,
	) {
		// verify
		if (body && (bodyParamsList.length || queryParamsList.length)) {
			throw new coda.UserVisibleError(
				[
					'You cannot use body with bodyParams nor queryParams.',
					'Catch Raw Hooks only use body.',
					'Catch Hooks only use either bodyParams, queryParams, or both.',
					'See https://coda.io/@balupton/zapier-hooks-pack#_luaQX for details.',
				].join('\n'),
			)
		}

		// generate body
		if (!body && bodyParamsList.length) {
			const bodyParamsRecord: Record<string, string> = {}
			while (bodyParamsList.length) {
				const key = bodyParamsList.shift() as string
				const value = bodyParamsList.length
					? (bodyParamsList.shift() as string)
					: ''
				bodyParamsRecord[key] = value
			}
			body = JSON.stringify(bodyParamsRecord)
		}

		// generate url
		const queryParamsRecord: Record<string, string> = {}
		while (queryParamsList.length) {
			const key = queryParamsList.shift() as string
			const value = queryParamsList.length
				? (queryParamsList.shift() as string)
				: ''
			queryParamsRecord[key] = value
		}
		const url = coda.withQueryParams(where, queryParamsRecord)

		// request with the optional body
		const request: coda.FetchRequest = {
			url,
			method: 'POST',
		}
		if (body) request.body = body

		// return the response
		try {
			const response = await context.fetcher.fetch<string>(request)
			const result = response.body || ''
			return result
		} catch (rawError: any) {
			if (rawError.statusCode) {
				const error = rawError as coda.StatusCodeError
				throw new coda.UserVisibleError(
					`Required failed with error ${error.statusCode}`,
				)
			}
			throw new coda.UserVisibleError('Request failed.')
		}
	},
})
