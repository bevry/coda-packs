import * as coda from '@codahq/packs-sdk'

export const UserIdentifierParam = coda.makeParameter({
	name: 'User Identifier',
	description: 'User Identifier',
	type: coda.ParameterType.String,
	optional: false,
})

export const ChannelIdentifierParam = coda.makeParameter({
	name: 'Channel Identifier',
	description: 'Channel Identifier',
	type: coda.ParameterType.String,
	optional: false,
})

export const TagIdentifierParam = coda.makeParameter({
	name: 'Tag Identifier',
	description: 'Tag Identifier',
	type: coda.ParameterType.String,
	optional: false,
})

export const CategoryIdentifierParam = coda.makeParameter({
	name: 'Category Identifier',
	description: 'Category Identifier',
	type: coda.ParameterType.String,
	optional: false,
})

export const CategoryNameParam = coda.makeParameter({
	name: 'Category Name',
	description: 'Category Name',
	type: coda.ParameterType.String,
	optional: false,
})

export const StreamTitleParam = coda.makeParameter({
	name: 'stream_title',
	description: 'Stream Title',
	optional: true,
	type: coda.ParameterType.String,
})

export const StreamDelayParam = coda.makeParameter({
	name: 'stream_delay',
	description: 'Stream Delay',
	optional: true,
	type: coda.ParameterType.Number,
})

export const LanguageParam = coda.makeParameter({
	name: 'language',
	description: 'Language Identifier (ISO 639-1 two-letter code)',
	optional: true,
	type: coda.ParameterType.String,
})

export const SearchQueryParam = coda.makeParameter({
	name: 'query',
	description: 'Search Query',
	optional: false,
	type: coda.ParameterType.String,
})

export const SearchLiveOnlyParam = coda.makeParameter({
	name: 'live_only',
	description: 'Search Live Only',
	optional: true,
	type: coda.ParameterType.Boolean,
})
