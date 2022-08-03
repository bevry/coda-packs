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
			description: 'The URL of the hook to trigger',
		}),
		coda.makeParameter({
			type: coda.ParameterType.String,
			name: 'body',
			description: 'The body to send to the hook',
		}),
	],
	resultType: coda.ValueType.String,
	isAction: true,
	execute: async function ([url, body], context) {
		const response = await context.fetcher.fetch({
			url,
			method: 'POST',
			body,
		})
		return response.body
	},
})
