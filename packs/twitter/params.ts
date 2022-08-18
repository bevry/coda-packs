import * as coda from '@codahq/packs-sdk'

export const TweetMessageParam = coda.makeParameter({
	name: 'content',
	description: 'Content to Tweet',
	type: coda.ParameterType.String,
	optional: false,
})

export const UserIdParam = coda.makeParameter({
	name: 'user',
	description: 'User Identifier',
	type: coda.ParameterType.String,
	optional: false,
})

export const TweetIdParam = coda.makeParameter({
	name: 'tweet',
	description: 'Tweet Identifier',
	type: coda.ParameterType.String,
	optional: false,
})
