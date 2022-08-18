import * as coda from '@codahq/packs-sdk'
import {
	ActiveUser,
	DeleteTweetById,
	SendTweet,
	TweetsByActiveUser,
	TweetsByUserId,
} from './api'
import { TweetIdParam, TweetMessageParam, UserIdParam } from './params'
import { TweetSchema, UserSchema } from './schemas'

export const pack = coda.newPack()
pack.addNetworkDomain('twitter.com')

// User
// https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
// https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code
pack.setUserAuthentication({
	type: coda.AuthenticationType.OAuth2,
	authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
	tokenUrl: 'https://api.twitter.com/2/oauth2/token',
	scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
	useProofKeyForCodeExchange: true,
	getConnectionName: async function (context) {
		const user = await ActiveUser([], context)
		return user.username
	},
})

// User
pack.addFormula({
	name: 'ActiveUser',
	description: 'Active User',
	parameters: [],
	resultType: coda.ValueType.Object,
	schema: UserSchema,
	extraOAuthScopes: ['tweet.read', 'users.read'],
	execute: ActiveUser,
})

// Tweet
pack.addFormula({
	name: 'SendTweet',
	description: 'Send Tweet',
	parameters: [TweetMessageParam],
	resultType: coda.ValueType.String,
	isAction: true,
	extraOAuthScopes: ['tweet.read', 'tweet.write', 'users.read'],
	execute: SendTweet,
})

// Tweets by Active User
pack.addFormula({
	name: 'TweetsByActiveUser',
	description: 'Fetch Tweets for the Active User',
	parameters: [],
	resultType: coda.ValueType.Array,
	items: TweetSchema,
	extraOAuthScopes: ['tweet.read', 'users.read'],
	execute: TweetsByActiveUser,
})

// Tweets by User Id
pack.addFormula({
	name: 'TweetsByUserId',
	description: 'Fetch Tweets by User Identifier',
	parameters: [UserIdParam],
	resultType: coda.ValueType.Array,
	items: TweetSchema,
	extraOAuthScopes: ['tweet.read', 'users.read'],
	execute: TweetsByUserId,
})

// Delete Tweet
pack.addFormula({
	name: 'DeleteTweetById',
	description: 'Delete a Tweet by Tweet Identifier',
	parameters: [TweetIdParam],
	resultType: coda.ValueType.Boolean,
	isAction: true,
	extraOAuthScopes: ['tweet.read', 'tweet.write', 'users.read'],
	execute: DeleteTweetById,
})

// ====================================
// CODA SYNC TABLES

// Tweets by Active User
pack.addSyncTable({
	name: 'TweetsByActiveUser',
	schema: TweetSchema,
	identityName: 'Tweet',
	formula: {
		name: 'TweetsByActiveUser',
		description: 'Sync Tweets by the Active User.',
		parameters: [],
		execute: async function ([], context) {
			const tweets = await TweetsByActiveUser([], context)
			return { result: tweets }
		},
	},
})

// ====================================
// CODA COLUMN FORMATS

// pack.addColumnFormat({
// 	name: 'UserById',
// 	formulaName: 'UserById',
// })

// pack.addColumnFormat({
// 	name: 'Tweet',
// 	formulaName: 'TweetById',
// })
