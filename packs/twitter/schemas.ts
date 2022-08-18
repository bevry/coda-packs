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
	author_id?: string
	// conversation_id?: string
	// in_reply_to_user_id?: string
	// source?: string
	created_at?: string
}
export const TweetSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'Identifier',
			required: true,
			...stringSchema,
		},
		content: {
			description: 'Content',
			required: true,
			fromKey: 'text',
			...stringSchema,
		},
		author_id: {
			description: 'Author ID',
			required: false,
			...stringSchema,
		},
		created_at: {
			description: 'Creation time',
			required: false,
			...datetimeStringSchema,
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
