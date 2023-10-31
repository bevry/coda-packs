## Inspiration

I had coded a CoinGecko pack via the Web Interface as soon as packs became available. It has been used in several of my documents, from cryptocurrency project analysis, to cryptocurrency portfolio analysis. The Hackathon was the motivation to improve it for public consumption, and with parity with the CoinGecko API, as it was the most suitable pack to learn advanced Schemas and Sync Tables, to unlock further ambitions with Coda.

## What it does

Fetches cryptocurrency data from CoinGecko, the largest cryptocurrency data API.

## How I built it

Originally with the Web Interface with JavaScript, then for the Hackathon rewrote it with TypeScript using the `@codahq/packs-sdk` CLI for deployment, and added the additional functionality to make it a top quality submission. This process was livestream on Twitch at https://twitch.tv/balupton

## Challenges we ran into

Several challenges along the way, using `schema` or `items`, wrestling with TypeScript type errors, wrestling with CLI upload errors such as `Error in field at path "formats[0]": Could not find a formula definition for this format. Each format must reference the name of a formula defined in this pack.` which could do with a line number.

The final result uncovered this Coda bug:

1. Numbers with huge decimal values fail to convert into currencies.

And demonstrates the need for these improvements:

1. If the column format matches the formula object, do not refetch but use the result.
2. A schema's objects, and their properties, should be available via the "Add Column" dropdown without needing to manually create a matching column format for them first.
3. String schemas should be able to specify "Canvas" as a hint
4. Object schemas should be able to specify their identity column format as the hint, so manual conversion of the added column is not required (objects are added as text columns)

A demonstration of these was livestreamed, and the link will be sent to Coda once the livestream has finished.

## Accomplishments that I'm proud of

It works really well!

## What I learned

1. How to use the CLI
2. How smooth it is to use TypeScript and publish releases via the CLI
3. The building blocks for building more advanced types

## What's next for CoinGecko

Once CoinGecko provides an API for portfolio management, I will incorporate that, probably as a Paid tier.

I'll also use what I learned in this pack to code a FTX exchange pack, that will be able to bring in position data and even place advanced trades, such as using coda automations to place trades at specific price points.
