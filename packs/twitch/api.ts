import * as coda from '@codahq/packs-sdk'
import { FetchMethodType } from '@codahq/packs-sdk'
import { clientId, height, hour, day, width } from './config'
import {
	Category,
	GameResponse,
	RawCategory,
	RawTag,
	RawActiveUser,
	Tag,
	TagsResponse,
	TopGamesResponse,
	UpdateChannelInformationRequest,
	ActiveUserResponse,
	ChannelResponse,
	Channel,
	RawChannel,
	UserResponse,
	RawUser,
	User,
} from './types'

function parseImageUrl(url: string) {
	return url
		.replace('{width}', width.toString())
		.replace('{height}', height.toString())
}

function fetchFromTwitch<T>(
	context: coda.SyncExecutionContext | coda.ExecutionContext,
	method: FetchMethodType = 'GET',
	url: string,
	cache: number = hour
) {
	return context.fetcher.fetch<T>({
		method,
		url,
		cacheTtlSecs: cache,
		headers: {
			'Content-Type': 'application/json',
			'Client-ID': clientId,
		},
	})
}

// ====================================
// USER & CHANNEL

function parseUser(raw: RawActiveUser | RawUser): User {
	const user: User = {
		id: raw.id,
		login: raw.login,
		name: raw.display_name,
		description: raw.description,
		email: raw.email,
		promotion: raw.broadcaster_type,
		privilege: raw.type,
		offline_image_url: raw.offline_image_url,
		profile_image_url: raw.profile_image_url,
		created_at: raw.created_at,
	}
	return user
}

export async function getActiveUser(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const url = 'https://api.twitch.tv/helix/users'
	const response = await fetchFromTwitch<ActiveUserResponse>(
		context,
		'GET',
		url
	)
	const raw: RawActiveUser = response.body.data[0]
	const user: User = parseUser(raw)
	return user
}

// https://dev.twitch.tv/docs/api/reference#get-users
export async function getUsersFromIdentifiers(
	[...ids]: [...Array<string>],
	context: coda.ExecutionContext
) {
	// check
	if (ids.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid identifier.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/users', {
		id: ids,
	})
	const response = await fetchFromTwitch<UserResponse>(context, 'GET', url)

	// parse
	const result: Array<RawUser> = response.body.data
	const users: Array<User> = result.map(parseUser)

	// return
	return users
}

// https://dev.twitch.tv/docs/api/reference#get-users
export async function getUsersFromLogins(
	[...logins]: [...Array<string>],
	context: coda.ExecutionContext
) {
	// check
	if (logins.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid login.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/users', {
		login: logins,
	})
	const response = await fetchFromTwitch<UserResponse>(context, 'GET', url)

	// parse
	const result: Array<RawUser> = response.body.data
	const users: Array<User> = result.map(parseUser)

	// return
	return users
}

function parseChannel(raw: RawChannel): Channel {
	const channel: Channel = {
		id: raw.broadcaster_id,
		login: raw.broadcaster_login,
		name: raw.broadcaster_name,
		category_id: raw.game_id,
		category_name: raw.game_name,
		language: raw.broadcaster_language,
		stream_title: raw.title,
		stream_delay: raw.delay,
	}
	return channel
}

// https://dev.twitch.tv/docs/api/reference#search-channels
export async function searchChannels(
	[query, live_only = false]: [string, boolean],
	context: coda.ExecutionContext
) {
	// check
	if (query == '') {
		throw new coda.UserVisibleError(`Need a search query.`)
	}

	// fetch
	const url = coda.withQueryParams(
		'https://api.twitch.tv/helix/search/channels',
		{
			query,
			live_only,
			first: 100,
		}
	)
	const response = await fetchFromTwitch<ChannelResponse>(context, 'GET', url)

	// parse
	const result: Array<RawChannel> = response.body.data
	const channels: Array<Channel> = result.map(parseChannel)

	// @todo, handle the extra returned properties
	// https://dev.twitch.tv/docs/api/reference#search-channels

	// return
	return channels
}

// https://dev.twitch.tv/docs/api/reference#get-channel-information
export async function getChannelsFromIdentifiers(
	[...ids]: [...Array<string>],
	context: coda.ExecutionContext
) {
	// check
	if (ids.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid identifier.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/channels', {
		broadcaster_id: ids,
	})
	const response = await fetchFromTwitch<ChannelResponse>(context, 'GET', url)

	// parse
	const result: Array<RawChannel> = response.body.data
	const channels: Array<Channel> = result.map(parseChannel)

	// return
	return channels
}

// https://dev.twitch.tv/docs/api/reference#modify-channel-information
export async function updateChannel(
	[channel_id, category_id, language, stream_title, stream_delay]: [
		string,
		string,
		string,
		string,
		number
	],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// send only necessary params
	const body: UpdateChannelInformationRequest = {}
	if (language) body.broadcaster_language = language
	if (category_id) body.game_id = category_id
	if (stream_title) body.title = stream_title
	if (stream_delay) body.delay = stream_delay

	// check channel
	if (Object.keys(body).length !== 0) {
		// fetch
		const url = coda.withQueryParams('https://api.twitch.tv/helix/channels', {
			broadcaster_id: channel_id,
		})
		const response = await context.fetcher.fetch({
			method: 'PATCH',
			url,
			headers: {
				'Content-Type': 'application/json',
				'Client-ID': clientId,
			},
			body: JSON.stringify(body),
		})

		// verify
		if (response.status !== 204) {
			throw new coda.UserVisibleError(
				`Failed to update the stream information.`
			)
		}
	} else {
		throw new coda.UserVisibleError(`Need at least one valid parameter.`)
	}

	// return
	return 'ok'
}

// ====================================
// TAGS

function parseTag(raw: RawTag): Tag {
	return {
		id: raw.tag_id,
		name: raw.localization_names['en-us'],
		description: raw.localization_descriptions['en-us'],
		is_auto: raw.is_auto,
	}
}

// https://dev.twitch.tv/docs/api/reference#get-all-stream-tags
// https://www.twitch.tv/directory/all/tags
export async function syncAvailableTags(
	[]: [],
	context: coda.SyncExecutionContext
) {
	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/tags/streams', {
		first: 100,
		after: context.sync.continuation?.after || null,
	})
	const response = await fetchFromTwitch<TagsResponse>(context, 'GET', url, day)

	// parse
	const result: Array<RawTag> = response.body.data
	const tags: Array<Tag> = result.map(parseTag)

	// last page, return results
	if (tags.length === 0) {
		return { result: tags }
	}

	//  result results and continue paging
	return {
		result: tags,
		continuation: {
			after: response.body.pagination.cursor,
		},
	}
}

// https://dev.twitch.tv/docs/api/reference#get-stream-tags
export async function getTagsFromChannelIdentifier(
	[channel_id]: [string],
	context: coda.ExecutionContext
) {
	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/streams/tags', {
		broadcaster_id: channel_id,
	})
	const response = await fetchFromTwitch<TagsResponse>(context, 'GET', url)

	// parse
	const result: Array<RawTag> = response.body.data
	const tags = result.map(parseTag)

	// return
	return tags
}

export async function getTagsFromIdentifiers(
	[...ids]: [...Array<string>],
	context: coda.ExecutionContext
) {
	// check
	if (ids.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid identifier.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/tags/streams', {
		first: 100,
		tag_id: ids,
	})
	const response = await fetchFromTwitch<TagsResponse>(context, 'GET', url)

	// parse
	const result: Array<RawTag> = response.body.data
	const tags = result.map(parseTag)

	// return
	return tags
}

// https://dev.twitch.tv/docs/api/reference#replace-stream-tags
export async function replaceStreamTags(
	[channel_id, ...tag_ids]: [string, ...Array<string>],
	context: coda.ExecutionContext
) {
	// check
	if (channel_id == '' || tag_ids.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid identifier.`)
	}
	if (tag_ids.length > 5) {
		throw new coda.UserVisibleError(
			`Too many tags were provided, it must be at max 5.`
		)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/streams/tags', {
		broadcaster_id: channel_id,
	})
	const response = await context.fetcher.fetch({
		method: 'PUT',
		url,
		headers: {
			'Content-Type': 'application/json',
			'Client-ID': clientId,
		},
		body: JSON.stringify({
			tag_ids: tag_ids,
		}),
	})

	// verify
	if (response.status !== 204) {
		throw new coda.UserVisibleError(`Failed to update the stream information.`)
	}

	// return
	return 'ok'
}

// ====================================
// CATEGORIES

function parseCategory(raw: RawCategory): Category {
	return {
		id: raw.id,
		name: raw.name,
		image: parseImageUrl(raw.box_art_url),
	}
}

// https://dev.twitch.tv/docs/api/reference#get-top-games
export async function getTopCategories(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// fetch
	const url = `https://api.twitch.tv/helix/games/top`
	const response = await fetchFromTwitch<TopGamesResponse>(context, 'GET', url)

	// parse
	const categories: Array<Category> = response.body.data.map(parseCategory)

	// return
	return categories
}

// https://dev.twitch.tv/docs/api/reference#search-categories
export async function searchCategories(
	[query]: [string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (query == '') {
		throw new coda.UserVisibleError(`Need a search query.`)
	}

	// fetch
	const url = coda.withQueryParams(
		'https://api.twitch.tv/helix/search/categories',
		{
			query,
		}
	)
	const response = await fetchFromTwitch<GameResponse>(context, 'GET', url)

	// parse
	const categories: Array<Category> = response.body.data.map(parseCategory)

	// return
	return categories
}

// https://dev.twitch.tv/docs/api/reference#get-games
export async function getCategoriesFromIdentifiers(
	[...ids]: [...Array<string>],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (ids.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid identifier.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/games', {
		id: ids,
	})
	const response = await fetchFromTwitch<GameResponse>(context, 'GET', url)

	// parse
	const categories: Array<Category> = response.body.data.map(parseCategory)

	// return
	return categories
}

export async function getCategoriesFromNames(
	[...names]: [...Array<string>],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (names.join('') == '') {
		throw new coda.UserVisibleError(`Need at least one valid name.`)
	}

	// fetch
	const url = coda.withQueryParams('https://api.twitch.tv/helix/games', {
		name: names,
	})
	const response = await fetchFromTwitch<GameResponse>(context, 'GET', url)

	// parse
	const categories: Array<Category> = response.body.data.map((result) => ({
		id: result.id,
		name: result.name,
		image: parseImageUrl(result.box_art_url),
	}))

	// return
	return categories
}
