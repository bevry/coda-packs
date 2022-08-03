import * as coda from '@codahq/packs-sdk'
export const pack = coda.newPack()

pack.addNetworkDomain('twitter.com')

// https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
// https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me
// https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code
pack.setUserAuthentication({
	type: coda.AuthenticationType.OAuth2,
	authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
	tokenUrl: 'https://api.twitter.com/2/oauth2/token',
	scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
	useProofKeyForCodeExchange: true,
	getConnectionName: async function (context) {
		let response = await context.fetcher.fetch({
			url: 'https://api.twitter.com/2/users/me',
			method: 'GET',
		})
		return response.body.data.username
	},
})

// https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
pack.addFormula({
	name: 'SendTweet',
	description: 'Send a tweet',
	parameters: [
		coda.makeParameter({
			type: coda.ParameterType.String,
			name: 'message',
			description: 'The tweet message to send',
		}),
	],
	resultType: coda.ValueType.String,
	isAction: true,
	extraOAuthScopes: ['tweet.read', 'tweet.write', 'users.read'],
	execute: async function ([message], context) {
		const response = await context.fetcher.fetch({
			url: 'https://api.twitter.com/2/tweets',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text: message,
			}),
		})
		return response.body
	},
})
