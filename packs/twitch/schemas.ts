import * as coda from '@codahq/packs-sdk'
import { AttributionNode } from '@codahq/packs-sdk'

const attribution: AttributionNode[] = [
	{
		type: coda.AttributionNodeType.Text,
		text: 'Provided by Twitch',
	},
	{
		type: coda.AttributionNodeType.Link,
		anchorText: 'twitch.tv',
		anchorUrl: 'https://twitch.tv',
	},
	{
		type: coda.AttributionNodeType.Image,
		imageUrl: 'https://twitch.tv/favicon.ico',
		anchorUrl: 'https://twitch.tv',
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
// USER & CHANNEL

export const UserSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'User’s Identifier',
			required: true,
			...stringSchema,
		},
		login: {
			description: 'User’s login name',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'User’s display name',
			required: true,
			...stringSchema,
		},
		description: {
			description: 'User’s channel description',
			required: false,
			...stringSchema,
		},
		email: {
			description: 'User’s verified email address',
			required: false,
			...stringSchema,
		},
		promotion: {
			description: 'User’s broadcaster type: "partner", "affiliate", or "".',
			required: false,
			...stringSchema,
		},
		privilege: {
			description: 'User’s type: "staff", "admin", "global_mod", or ""',
			required: false,
			...stringSchema,
		},
		offline_image_url: {
			description: 'URL of the user’s offline image',
			required: false,
			...imageSchema,
		},
		profile_image_url: {
			description: 'URL of the user’s profile image',
			required: false,
			...imageSchema,
		},
		created_at: {
			description: 'Date when the user was created',
			required: false,
			...datetimeStringSchema,
		},
	},
	identity: {
		name: 'User',
	},
	idProperty: 'id',
	displayProperty: 'login',
	descriptionProperty: 'description',
	imageProperty: 'profile_image_url',
	// title, subtitle
	// featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution,
	includeUnknownProperties: false,
})

export const ChannelSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'User’s Identifier',
			required: true,
			...stringSchema,
		},
		login: {
			description: 'User’s login name',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'User’s display name',
			required: true,
			...stringSchema,
		},
		language: {
			description:
				'Language of the channel. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”.',
			required: true,
			...stringSchema,
		},
		category_id: {
			description: 'Current category ID being streamed on the channel',
			required: true,
			...stringSchema,
		},
		category_name: {
			description: ' Name of the category being streamed on the channel',
			required: true,
			...stringSchema,
		},
		stream_title: {
			description: 'Title of the stream',
			required: true,
			...stringSchema,
		},
		stream_delay: {
			description: 'Stream delay in seconds',
			required: true,
			...numberSchema,
		},
	},
	identity: {
		name: 'Channel',
	},
	idProperty: 'id',
	displayProperty: 'login',
	// title, subtitle
	// featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution,
	includeUnknownProperties: false,
})

// ====================================
// TAGS

export const TagSchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'Identifier',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name',
			required: true,
			...stringSchema,
		},
		description: {
			description: 'Description',
			required: true,
			...stringSchema,
		},
		is_auto: {
			description: 'Automatic Tag?',
			required: true,
			...booleanSchema,
		},
	},
	identity: {
		name: 'Tag',
	},
	idProperty: 'id',
	displayProperty: 'name',
	descriptionProperty: 'description',
	// title, subtitle
	// featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution,
	includeUnknownProperties: false,
})

// ====================================
// CATEGORIES

export const CategorySchema = coda.makeObjectSchema({
	properties: {
		id: {
			description: 'Identifier',
			required: true,
			...stringSchema,
		},
		name: {
			description: 'Name',
			required: true,
			...stringSchema,
		},
		image: {
			description: 'Image',
			required: true,
			...imageSchema,
		},
	},
	identity: {
		name: 'Category',
	},
	idProperty: 'id',
	displayProperty: 'name',
	imageProperty: 'image',
	// descriptionProperty: 'url',
	// title, subtitle
	// featuredProperties: ['symbol', 'name', 'url', 'image'],
	attribution,
	includeUnknownProperties: false,
})
