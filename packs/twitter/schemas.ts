import * as coda from '@codahq/packs-sdk'
import { AttributionNode } from '@codahq/packs-sdk'
import { components } from 'twitter-api-sdk/dist/types'

const attribution: AttributionNode[] = [
	{
		type: coda.AttributionNodeType.Text,
		text: 'Provided by Twitter',
	},
	{
		type: coda.AttributionNodeType.Link,
		anchorText: 'twitter.com',
		anchorUrl: 'https://twitter.com',
	},
	{
		type: coda.AttributionNodeType.Image,
		imageUrl: 'https://twitter.com/favicon.ico',
		anchorUrl: 'https://twitter.com',
	},
]

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

// ====================================
// USER

export type RawUser = components['schemas']['User']
export interface User {
	id: string
	username: string
	name?: string
	description?: string
	homepage?: string
	image?: string
	created_at?: string
}
export const UserSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'Identifier',
			required: true,
			...stringSchema,
		},
		username: {
			description: 'Username',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name',
			required: false,
			...stringSchema,
		},
		description: {
			description: 'Description',
			required: false,
			...stringSchema,
		},
		homepage: {
			description: 'Homepage',
			required: false,
			fromKey: 'url',
			...urlSchema,
		},
		image: {
			description: 'Image',
			required: false,
			fromKey: 'profile_image_url',
			...imageSchema,
		},
		created_at: {
			description: 'Creation time',
			required: false,
			...datetimeStringSchema,
		},
	},
	identity: {
		name: 'User',
	},
	idProperty: 'id',
	displayProperty: 'username',
	descriptionProperty: 'description',
	imageProperty: 'image',
	attribution,
	includeUnknownProperties: false,
})

// ====================================
// Tweet

export type RawTweet = components['schemas']['Tweet']
export interface Tweet {
	id: string
	content: string
	created_at: string
	author_id: string
	conversation_id: string
	in_reply_to_user_id: string
	// source?: string
}
export const TweetSchema = coda.makeObjectSchema({
	properties: {
		id: {
			// Unique identifier of this Tweet. This is returned as a string in order to avoid complications with languages and tools that cannot handle large integers.
			description: 'Tweet ID',
			required: true,
			...stringSchema,
		},
		content: {
			// The content of the Tweet.
			description: 'Content',
			required: true,
			fromKey: 'text',
			...stringSchema,
		},
		created_at: {
			// Creation time of the Tweet. For example: 2020-12-10T20:00:10Z
			description: `Creation Time`,
			required: true,
			...datetimeStringSchema,
		},
		author_id: {
			// Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools that cannot handle large integers.
			description: 'User ID of Tweet Author',
			required: true,
			...stringSchema,
		},
		conversation_id: {
			// The Tweet ID of the original Tweet of the conversation (which includes direct replies, replies of replies).
			description: 'Conversation Tweet ID',
			required: true,
			...stringSchema,
		},
		in_reply_to_user_id: {
			// If this Tweet is a Reply, indicates the user ID of the parent Tweet's author. This is returned as a string in order to avoid complications with languages and tools that cannot handle large integers.
			description: `User ID of Parent Tweet`,
			required: true,
			...stringSchema,
		},
	},
	identity: {
		name: 'Tweet',
	},
	idProperty: 'id',
	displayProperty: 'content',
	// title, subtitle
	// featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution,
	includeUnknownProperties: false,
})
