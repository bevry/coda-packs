import * as coda from '@codahq/packs-sdk'

export const pack = coda.newPack()

export const UnformattedTextParam = coda.makeParameter({
	name: 'Unformatted Text',
	description: 'The unformatted text that you would like to format',
	type: coda.ParameterType.String,
	optional: false,
})

export const CodaBlockLanguageParam = coda.makeParameter({
	name: 'Code Language',
	description: 'The language that the code is using',
	type: coda.ParameterType.String,
	optional: true,
})

pack.addFormula({
	name: 'Newline',
	description: 'Give us a newline',
	parameters: [],
	resultType: coda.ValueType.String,
	// codaType: coda.ValueHintType.Html,
	execute: async function ([]: [], context) {
		return '\n'
	},
})

pack.addFormula({
	name: 'Html',
	description: 'Format the input text as if it is HTML',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return input
	},
})

pack.addFormula({
	name: 'HtmlHeading1',
	description: 'Make the text the primary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<h1>${input}</h1>`
	},
})

pack.addFormula({
	name: 'HtmlHeading2',
	description: 'Make the text the secondary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<h2>${input}</h2>`
	},
})

pack.addFormula({
	name: 'HtmlHeading3',
	description: 'Make the text the third level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<h3>${input}</h3>`
	},
})

pack.addFormula({
	name: 'HtmlHeading4',
	description: 'Make the text the fourth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<h4>${input}</h4>`
	},
})

pack.addFormula({
	name: 'HtmlItalic',
	description: 'Make the text italic',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<em>${input}<em>`
	},
})

pack.addFormula({
	name: 'HtmlBold',
	description: 'Make the text bold',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<strong>${input}</strong>`
	},
})

pack.addFormula({
	name: 'HtmlUnderline',
	description: 'Make the text underlined',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<u>${input}</u>`
	},
})

pack.addFormula({
	name: 'HtmlStrikethrough',
	description:
		'Make the text have a line through it, as if it has been cancelled out',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<s>${input}</s>`
	},
})

pack.addFormula({
	name: 'HtmlCodeInline',
	description: 'Make the text as inline code',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<code>${input}</code>`
	},
})

pack.addFormula({
	name: 'HtmlSupertext',
	description:
		'Make the text as supertext, which is text above the standard line height',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<sup>${input}</sup>`
	},
})

pack.addFormula({
	name: 'HtmlSubtext',
	description:
		'Make the text as subtext, which is text below the standard line height',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return `<sub>${input}</sub>`
	},
})

pack.addFormula({
	name: 'Markdown',
	description: 'Format the input text as if it is markdown',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return input
	},
})

pack.addFormula({
	name: 'MarkdownHeading1',
	description: 'Make the text the primary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `# ${input}`
	},
})

pack.addFormula({
	name: 'MarkdownHeading2',
	description: 'Make the text the secondary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `## ${input}`
	},
})

pack.addFormula({
	name: 'MarkdownHeading3',
	description: 'Make the text the third level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `### ${input}`
	},
})

pack.addFormula({
	name: 'MarkdownHeading4',
	description: 'Make the text the fourth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `#### ${input}`
	},
})
pack.addFormula({
	name: 'MarkdownItalic',
	description: 'Make the text italic',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `*${input}*`
	},
})

pack.addFormula({
	name: 'MarkdownBold',
	description: 'Make the text bold',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `**${input}**`
	},
})

pack.addFormula({
	name: 'MarkdownUnderline',
	description: 'Make the text underlined',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `***${input}***`
	},
})

pack.addFormula({
	name: 'MarkdownStrikethrough',
	description:
		'Make the text have a line through it, as if it has been cancelled out',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `~~${input}~~`
	},
})

pack.addFormula({
	name: 'MarkdownCodeInline',
	description: 'Make the text as inline code',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `\`${input}\``
	},
})

pack.addFormula({
	name: 'MarkdownCodeBlock',
	description: 'Make the text as a code block',
	parameters: [UnformattedTextParam, CodaBlockLanguageParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input, language]: [string, string?], context) {
		return '```' + ` ${language}\n${input}\n` + '```'
	},
})

pack.addFormula({
	name: 'MarkdownQuote',
	description: 'Make each line of text, part of a quote',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '> ' + input.replace(/\n/g, '\n> ')
	},
})

pack.addFormula({
	name: 'MarkdownUnorderedList',
	description: 'Make each line of text, as an unordered list item',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '* ' + input.replace(/\n/g, '\n* ')
	},
})

pack.addFormula({
	name: 'MarkdownOrderedList',
	description: 'Make each line of text, as an ordered list item',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '1. ' + input.replace(/\n/g, '\n1. ')
	},
})
