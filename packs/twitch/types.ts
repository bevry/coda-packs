interface Paginated {
	pagination: {
		/** A cursor value, to be used in a subsequent request to specify the starting point of the next set of results. */
		cursor: string
	}
}

// ====================================
// CHANNEL

export interface User {
	/** User’s ID. */
	id: string
	/** User’s login name. */
	login: string
	/** User’s display name. */
	name: string
	/** User’s channel description. */
	description?: string
	/** User’s verified email address. Returned if the request includes the user:read:email scope. */
	email?: string
	/** User’s broadcaster type: "partner", "affiliate", or "". */
	promotion?: string
	/** User’s type: "staff", "admin", "global_mod", or "". */
	privilege?: string
	/** URL of the user’s offline image. */
	offline_image_url?: string
	/** URL of the user’s profile image. */
	profile_image_url?: string
	/** Date when the user was created. */
	created_at?: string
}

export interface Channel {
	/** User’s ID. */
	id: string
	/** User’s login name. */
	login: string
	/** User’s display name. */
	name: string
	/** Language of the channel. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”. */
	language: string
	/** Current game ID being played on the channel. */
	category_id: string
	/** Name of the game being played on the channel. */
	category_name: string
	/** Title of the stream. */
	stream_title: string
	/** Stream delay in seconds. */
	stream_delay: number
}

export interface RawActiveUser {
	/** User’s ID. */
	id: string
	/** User’s login name. */
	login: string
	/** User’s display name. */
	display_name: string
	/** User’s channel description. */
	description: string
	/** User’s verified email address. Returned if the request includes the user:read:email scope. */
	email: string
	/** User’s broadcaster type: "partner", "affiliate", or "". */
	broadcaster_type: string
	/** User’s type: "staff", "admin", "global_mod", or "". */
	type: string
	/** URL of the user’s offline image. */
	offline_image_url: string
	/** URL of the user’s profile image. */
	profile_image_url: string
	/** Date when the user was created. */
	created_at: string
}

export interface ActiveUserResponse {
	data: Array<RawActiveUser>
}

export interface RawUser {
	/** User’s ID. */
	id: string
	/** User’s login name. */
	login: string
	/** User’s display name. */
	display_name: string
	/** User’s channel description. */
	description: string
	/** User’s verified email address. Returned if the request includes the user:read:email scope. */
	email: string
	/** User’s broadcaster type: "partner", "affiliate", or "". */
	broadcaster_type: string
	/** User’s type: "staff", "admin", "global_mod", or "". */
	type: string
	/** URL of the user’s offline image. */
	offline_image_url: string
	/** URL of the user’s profile image. */
	profile_image_url: string
	/** Date when the user was created. */
	created_at: string
	/** Total number of views of the user’s channel. NOTE: This field has been deprecated. For information, see Get Users API endpoint – “view_count” deprecation. The response continues to include the field; however, it contains stale data. You should stop displaying this data at your earliest convenience. */
	view_count: number
}

export interface UserResponse {
	data: Array<RawUser>
}

export interface RawChannel {
	/** Twitch User ID of this channel owner. */
	broadcaster_id: string
	/** Broadcaster’s user login name. */
	broadcaster_login: string
	/** Twitch user display name of this channel owner. */
	broadcaster_name: string
	/** Name of the game being played on the channel. */
	game_name: string
	/** Current game ID being played on the channel. */
	game_id: string
	/** Language of the channel. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”. */
	broadcaster_language: string
	/** Title of the stream. */
	title: string
	/** Stream delay in seconds. */
	delay: number
}

export interface ChannelResponse {
	data: Array<RawChannel>
}

export interface UpdateChannelInformationRequest {
	/** The current game ID being played on the channel. Use “0” or “” (an empty string) to unset the game. */
	game_id?: string

	/** The language of the channel. A language value must be either the ISO 639-1 two-letter code for a supported stream language or “other”. */
	broadcaster_language?: string

	/** The title of the stream. Value must not be an empty string. */
	title?: string

	/** Stream delay in seconds. Stream delay is a Twitch Partner feature; trying to set this value for other account types will return a 400 error. */
	delay?: number
}

// ====================================
// TAGS

export interface Tag {
	id: string
	name: string
	description: string
	is_auto: boolean
}

export interface RawTag {
	/** An ID that identifies the tag. */
	tag_id: string
	/** A Boolean value that determines whether the tag is an automatic tag. An automatic tag is one that Twitch adds to the stream. You cannot add or remove automatic tags. The value is true if the tag is an automatic tag; otherwise, false. */
	is_auto: boolean
	/** A dictionary that contains the localized names of the tag. The key is in the form, <locale>-<coutry/region>. For example, us-en. The value is the localized name. */
	localization_names: Localization
	/** A dictionary that contains the localized descriptions of the tag. The key is in the form, <locale>-<coutry/region>. For example, us-en. The value is the localized description. */
	localization_descriptions: Localization
}

export interface TagsResponse extends Paginated {
	data: Array<RawTag>
}

// ====================================
// CATEGORIES

export interface Category {
	id: string
	name: string
	image: string
}

export interface RawCategory {
	box_art_url: string
	id: string
	name: string
}

export type GameRequest =
	| {
			/** Game ID. At most 100 id values can be specified. */
			id: string
	  }
	| {
			/** Game name. The name must be an exact match. For example, “Pokemon” will not return a list of Pokemon games; instead, query any specific Pokemon games in which you are interested. At most 100 name values can be specified. */
			name: string
	  }

export interface GameResponse extends Paginated {
	data: Array<RawCategory>
}

export interface TopGamesRequest {
	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	after?: string
	/** Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	before?: string
	/** Maximum number of objects to return. Maximum: 100. Default: 20. */
	first?: number
}

export interface TopGamesResponse extends Paginated {
	data: Array<RawCategory>
}

interface Localization {
	[locale: string]: string
	'en-us': string
}
