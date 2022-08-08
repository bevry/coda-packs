import * as coda from '@codahq/packs-sdk'

import { CategorySchema, ChannelSchema, TagSchema, UserSchema } from './schemas'
import {
	CategoryIdentifierParam,
	CategoryNameParam,
	ChannelIdentifierParam,
	LanguageParam,
	SearchLiveOnlyParam,
	SearchQueryParam,
	StreamDelayParam,
	StreamTitleParam,
	TagIdentifierParam,
	UserIdentifierParam,
} from './params'
import {
	syncAvailableTags,
	getCategoriesFromIdentifiers,
	getCategoriesFromNames,
	getTagsFromIdentifiers,
	getTopCategories,
	updateChannel,
	getActiveUser,
	getChannelsFromIdentifiers,
	getUsersFromIdentifiers,
	getUsersFromLogins,
	replaceStreamTags,
	getTagsFromChannelIdentifier,
	searchChannels,
	searchCategories,
} from './api'
import { clientId, day } from './config'

// https://dev.twitch.tv/console/apps/create
// https://dev.twitch.tv/docs/api/get-started
// https://dev.twitch.tv/docs/authentication/refresh-tokens
// https://dev.twitch.tv/docs/authentication/validate-tokens
// https://dev.twitch.tv/docs/authentication/scopes

// channel:manage:broadcast
// https://dev.twitch.tv/docs/api/reference#modify-channel-information
// https://dev.twitch.tv/docs/api/reference#create-stream-marker
// https://dev.twitch.tv/docs/api/reference#replace-stream-tags

// channel:manage:raids
// https://dev.twitch.tv/docs/api/reference#start-a-raid

// channel:manage:videos
// https://dev.twitch.tv/docs/api/reference#delete-videos

// clips:edit
// https://dev.twitch.tv/docs/api/reference#create-clip
// creating clips

// user:edit
// https://dev.twitch.tv/docs/api/reference#update-user
// only user description, don't care

// ==============
// CODA PACK

export const pack = coda.newPack()

pack.addNetworkDomain('twitch.tv')

// https://dev.twitch.tv/console/apps
pack.setUserAuthentication({
	type: coda.AuthenticationType.OAuth2,
	authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
	tokenUrl: 'https://id.twitch.tv/oauth2/token',
	scopes: [
		'channel:manage:broadcast',
		'channel:manage:raids',
		'channel:manage:videos',
		'clips:edit',
	],
	// useProofKeyForCodeExchange: true,
	getConnectionName: async function (context) {
		const user = await getActiveUser([], context)
		return user.login
	},
})

// ====================================
// USER

// @todo https://dev.twitch.tv/docs/api/reference#get-users-follows

pack.addFormula({
	name: 'GetActiveUser',
	description: 'Get the active User information',
	parameters: [],
	resultType: coda.ValueType.Object,
	schema: UserSchema,
	execute: getActiveUser,
})

pack.addFormula({
	name: 'GetUsersFromIdentifiers',
	description: 'Fetch the User that exact match a series of Identifiers',
	resultType: coda.ValueType.Array,
	items: UserSchema,
	parameters: [],
	varargParameters: [UserIdentifierParam],
	execute: getUsersFromIdentifiers,
})

pack.addFormula({
	name: 'GetUserByIdentifier',
	description: 'Fetch the User that exact matches this Identifier',
	resultType: coda.ValueType.Array,
	items: UserSchema,
	parameters: [UserIdentifierParam],
	execute: getUsersFromIdentifiers,
})

pack.addFormula({
	name: 'GetUsersFromLogins',
	description: 'Fetch the User that exact match a series of Logins',
	resultType: coda.ValueType.Array,
	items: UserSchema,
	parameters: [],
	varargParameters: [UserIdentifierParam],
	execute: getUsersFromLogins,
})

pack.addFormula({
	name: 'GetUserByLogin',
	description: 'Fetch the User that exact matches this Login',
	resultType: coda.ValueType.Array,
	items: UserSchema,
	parameters: [UserIdentifierParam],
	execute: getUsersFromLogins,
})

// ====================================
// CHANNEL

pack.addFormula({
	name: 'SearchChannels',
	description: 'Fetch the Channels that match the search query',
	resultType: coda.ValueType.Array,
	items: ChannelSchema,
	parameters: [SearchQueryParam, SearchLiveOnlyParam],
	execute: searchChannels,
})

pack.addFormula({
	name: 'GetChannelsFromIdentifiers',
	description: 'Fetch the Channel that exact match a series of Identifiers',
	resultType: coda.ValueType.Array,
	items: ChannelSchema,
	parameters: [],
	varargParameters: [ChannelIdentifierParam],
	execute: getChannelsFromIdentifiers,
})

pack.addFormula({
	name: 'GetChannelByIdentifier',
	description: 'Fetch the Channel that exact matches this Identifier',
	resultType: coda.ValueType.Array,
	items: ChannelSchema,
	parameters: [ChannelIdentifierParam],
	execute: getChannelsFromIdentifiers,
})

pack.addFormula({
	name: 'UpdateChannel',
	description: 'Update Channel information',
	parameters: [
		ChannelIdentifierParam,
		CategoryIdentifierParam,
		LanguageParam,
		StreamTitleParam,
		StreamDelayParam,
	],
	resultType: coda.ValueType.String,
	isAction: true,
	extraOAuthScopes: ['channel:manage:broadcast'],
	execute: updateChannel,
})

// ====================================
// TAGS

// @todo https://dev.twitch.tv/docs/api/reference#replace-stream-tags

// pack.addFormula({
// 	name: 'GetAvailableTags',
// 	description: 'Fetch all the available tags',
// 	resultType: coda.ValueType.Array,
// 	items: TagSchema,
// 	parameters: [],
// 	execute: getAvailableTags,
// })

pack.addSyncTable({
	name: 'Tags',
	schema: TagSchema,
	identityName: 'Tag',
	formula: {
		name: 'SyncAvailableTags',
		description: 'Sync available Tags',
		parameters: [],
		execute: async function ([], context) {
			return await syncAvailableTags([], context)
		},
	},
})

pack.addFormula({
	name: 'getTagsFromChannelIdentifier',
	description: 'Fetch the Tags currently applied to the Channel',
	resultType: coda.ValueType.Array,
	items: TagSchema,
	parameters: [ChannelIdentifierParam],
	execute: getTagsFromChannelIdentifier,
})

pack.addFormula({
	name: 'GetTagsFromIdentifiers',
	description: 'Fetch the Tags that exact match a series of Identifiers',
	resultType: coda.ValueType.Array,
	items: TagSchema,
	parameters: [],
	varargParameters: [TagIdentifierParam],
	execute: getTagsFromIdentifiers,
})

pack.addFormula({
	name: 'GetTagByIdentifier',
	description: 'Fetch the Tag that exact matches this Identifier',
	resultType: coda.ValueType.Array,
	items: TagSchema,
	parameters: [TagIdentifierParam],
	execute: getTagsFromIdentifiers,
})

pack.addFormula({
	name: 'ReplaceStreamTags',
	description: 'Replace Stream Tags',
	parameters: [ChannelIdentifierParam],
	varargParameters: [TagIdentifierParam],
	resultType: coda.ValueType.String,
	isAction: true,
	extraOAuthScopes: ['channel:manage:broadcast'],
	execute: replaceStreamTags,
})

// ====================================
// CATEGORIES

pack.addFormula({
	name: 'GetTopCategories',
	description: 'Fetch the top Categories',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [],
	execute: getTopCategories,
})

pack.addFormula({
	name: 'SearchCategories',
	description: 'Fetch the Categories that match a Search Query',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [SearchQueryParam],
	execute: searchCategories,
})

pack.addFormula({
	name: 'GetCategoriesFromIdentifiers',
	description: 'Fetch the Categories that exact match a series of Identifiers',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [],
	varargParameters: [CategoryIdentifierParam],
	execute: getCategoriesFromIdentifiers,
})

pack.addFormula({
	name: 'GetCategoryByIdentifier',
	description: 'Fetch the Category that exact matches this Identifier',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [CategoryIdentifierParam],
	execute: getCategoriesFromIdentifiers,
})

pack.addFormula({
	name: 'GetCategoriesFromNames',
	description: 'Fetch the Categories that exact match a series of Names',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [],
	varargParameters: [CategoryNameParam],
	execute: getCategoriesFromNames,
})

pack.addFormula({
	name: 'GetCategoryByName',
	description: 'Fetch the Category that exact matches this Name',
	resultType: coda.ValueType.Array,
	items: CategorySchema,
	parameters: [CategoryNameParam],
	execute: getCategoriesFromNames,
})

// ====================================
// STREAMS

// @todo https://dev.twitch.tv/docs/api/reference#get-streams

// @todo https://dev.twitch.tv/docs/api/reference#get-followed-streams

// ====================================
// STREAM MARKERS

// @todo https://dev.twitch.tv/docs/api/reference#create-stream-marker

// @todo https://dev.twitch.tv/docs/api/reference#get-stream-markers

// ====================================
// VIDEOS

// @todo https://dev.twitch.tv/docs/api/reference#get-videos

// @skip https://dev.twitch.tv/docs/api/reference#delete-videos

// ====================================
// CLIPS

// @todo https://dev.twitch.tv/docs/api/reference#create-clip

// @todo https://dev.twitch.tv/docs/api/reference#get-clips

// ====================================
// ANNOUNCEMENTS

// @todo https://dev.twitch.tv/docs/api/reference#send-chat-announcement

// ====================================
// CODA COLUMN FORMATS

pack.addColumnFormat({
	name: 'UserByIdentifier',
	formulaName: 'GetUserByIdentifier',
})

pack.addColumnFormat({
	name: 'UserByLogin',
	formulaName: 'GetUserByLogin',
})

pack.addColumnFormat({
	name: 'ChannelByIdentifier',
	formulaName: 'GetChannelByIdentifier',
})

pack.addColumnFormat({
	name: 'TagByIdentifier',
	formulaName: 'GetTagByIdentifier',
})

pack.addColumnFormat({
	name: 'CategoryByIdentifier',
	formulaName: 'GetCategoryByIdentifier',
})

pack.addColumnFormat({
	name: 'CategoryByName',
	formulaName: 'GetCategoryByName',
})
