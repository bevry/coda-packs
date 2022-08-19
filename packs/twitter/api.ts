import * as coda from '@codahq/packs-sdk'

import {
	createTweet,
	deleteTweetById,
	findMyUser,
	TwitterBody,
	TwitterParams,
	TwitterResponse,
	usersIdTweets,
} from 'twitter-api-sdk/dist/types'

// don't use caching, as data is always changing
// const minute = 60
// const hour = minute * 60
// const day = hour * 24

// https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me
// tweet.read users.read
export async function ActiveUser(
	[]: [],
	// [user_fields = []]: [Array<TwitterParams<findMyUser>['user.fields']>?],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// fetch
	const query: TwitterParams<findMyUser> = {
		// @ts-ignore
		// 'user.fields': user_fields.join(','),
	}
	const url = coda.withQueryParams('https://api.twitter.com/2/users/me', query)
	const response = await context.fetcher.fetch<TwitterResponse<findMyUser>>({
		url,
		method: 'GET',
	})

	// verify
	if (!response.body || response.body.errors || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to fetch user data.`)
	}

	// return
	const result = response.body.data!
	return result
}

// https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
// tweet.read tweet.write users.read
export async function SendTweet(
	[message]: [string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (!message) {
		throw new coda.UserVisibleError(`A message is required to send a tweet.`)
	}

	// fetch
	const body: TwitterBody<createTweet> = {
		text: message,
	}
	const response = await context.fetcher.fetch<TwitterResponse<createTweet>>({
		url: 'https://api.twitter.com/2/tweets',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})

	// verify
	if (!response.body || response.body.errors || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to send tweet.`)
	}

	// return
	const result = response.body.data!
	return result.id
}

// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
// tweet.read users.read
export async function TweetsByUserId(
	[id]: [string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (!id) {
		throw new coda.UserVisibleError(
			`A user identifier is required to fetch tweets for a user.`
		)
	}

	// fetch
	const query: TwitterParams<usersIdTweets> = {
		max_results: 100,
		// @ts-ignore
		'tweet.fields': [
			'id',
			'author_id',
			'created_at',
			'conversation_id',
			'in_reply_to_user_id',
		].join(','),
	}
	const url = coda.withQueryParams(
		`https://api.twitter.com/2/users/${id}/tweets`,
		query
	)
	const response = await context.fetcher.fetch<TwitterResponse<usersIdTweets>>({
		url: url,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// verify
	if (!response.body || response.body.errors || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to send tweet.`)
	}

	// return
	const result = response.body.data!
	return result
}

export async function TweetsByActiveUser(
	[]: [],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	const user = await ActiveUser([], context)
	const tweets = await TweetsByUserId([user.id], context)
	return tweets
}

// https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/delete-tweets-id
// tweet.read tweet.write users.read
export async function DeleteTweetById(
	[id]: [string],
	context: coda.SyncExecutionContext | coda.ExecutionContext
) {
	// check
	if (!id) {
		throw new coda.UserVisibleError(
			`A tweet identifier is required to delete a tweet.`
		)
	}

	// fetch
	const url = `https://api.twitter.com/2/tweets/${id}`
	const response = await context.fetcher.fetch<
		TwitterResponse<deleteTweetById>
	>({
		url: url,
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	// verify
	if (!response.body || response.body.errors || !response.body.data) {
		throw new coda.UserVisibleError(`Failed to delete tweet.`)
	}
	if (!response.body.data.deleted) {
		throw new coda.UserVisibleError(`Tweet was not deleted.`)
	}

	// return
	const result = response.body.data!
	return result.deleted
}
