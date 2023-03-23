import * as coda from '@codahq/packs-sdk'

export const pack = coda.newPack()

export const UnformattedTextParam = coda.makeParameter({
	name: 'UnformattedText',
	description: 'The unformatted text that you would like to format',
	type: coda.ParameterType.String,
	optional: false,
})

export const CodaBlockLanguageParam = coda.makeParameter({
	name: 'CodeLanguage',
	description: 'The language that the code is using',
	type: coda.ParameterType.String,
	optional: true,
})

function hydrateUnsupportedElements(html: string) {
	// ALL elements within an unsupported element are trimmed
	return html.replace(/<(sup|sub)>/g, '<em>').replace(/<\/(sup|sub)>/g, '</em>')
}

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

// ====================================
// HTML

pack.addFormula({
	name: 'Html',
	description: 'Format the input text as if it is HTML',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(input)
	},
})

pack.addFormula({
	name: 'HtmlHeading1',
	description: 'Make the text the primary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h1>${input}</h1>`)
	},
})

pack.addFormula({
	name: 'HtmlHeading2',
	description: 'Make the text the secondary header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h2>${input}</h2>`)
	},
})

pack.addFormula({
	name: 'HtmlHeading3',
	description: 'Make the text the third level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h3>${input}</h3>`)
	},
})

pack.addFormula({
	name: 'HtmlHeading4',
	description: 'Make the text the fourth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h4>${input}</h4>`)
	},
})

pack.addFormula({
	name: 'HtmlHeading5',
	description: 'Make the text the fifth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h5>${input}</h5>`)
	},
})

pack.addFormula({
	name: 'HtmlHeading6',
	description: 'Make the text the sixth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<h6>${input}</h6>`)
	},
})

pack.addFormula({
	name: 'HtmlItalic',
	description: 'Make the text italic',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<em>${input}<em>`)
	},
})

pack.addFormula({
	name: 'HtmlBold',
	description: 'Make the text bold',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<strong>${input}</strong>`)
	},
})

pack.addFormula({
	name: 'HtmlUnderline',
	description: 'Make the text underlined',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<u>${input}</u>`)
	},
})

pack.addFormula({
	name: 'HtmlStrikethrough',
	description:
		'Make the text render with a line through it, as if it has been cancelled out',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		// strike is
		return hydrateUnsupportedElements(`<s>${input}</s>`)
	},
})

pack.addFormula({
	name: 'HtmlDelete',
	description: 'Make the text indicate that it was deleted',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		// strike is
		return hydrateUnsupportedElements(`<del>${input}</del>`)
	},
})

pack.addFormula({
	name: 'HtmlInsert',
	description: 'Make the text indicate that it was inserted',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		// strike is
		return hydrateUnsupportedElements(`<ins>${input}</ins>`)
	},
})

pack.addFormula({
	name: 'HtmlCodeInline',
	description: 'Make the text render as inline code',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<code>${input}</code>`)
	},
})

pack.addFormula({
	name: 'HtmlSupertext',
	description:
		'Make the text render as supertext, which currently Coda does not support, so it will be replaced by emphasis',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<sup>${input}</sup>`)
	},
})

pack.addFormula({
	name: 'HtmlSubtext',
	description:
		'Make the text render as subtext, which currently Coda does not support, so it will be replaced by emphasis',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<sub>${input}</sub>`)
	},
})

pack.addFormula({
	name: 'HtmlQuote',
	description: 'Make the text render as a quote',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([input]: [string], context) {
		return hydrateUnsupportedElements(`<blockquote>${input}</blockquote>`)
	},
})

pack.addFormula({
	name: 'HtmlElements',
	description:
		'Attempt to render all the elements that Coda may or may not support',
	parameters: [],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Html,
	execute: async function ([]: [], context) {
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
		return [
			'a',
			'abbr',
			'acronym',
			'address',
			'applet',
			'area',
			'article',
			'aside',
			'audio',
			'b',
			'base',
			'bdi',
			'bdo',
			'bgsound',
			'big',
			'blink',
			'blockquote',
			'body',
			'br',
			'button',
			'canvas',
			'caption',
			'center',
			'cite',
			'code',
			'col',
			'colgroup',
			'content',
			'data',
			'datalist',
			'dd',
			'del',
			'details',
			'dfn',
			'dialog',
			'dir',
			'div',
			'dl',
			'dt',
			'em',
			'embed',
			'fieldset',
			'figcaption',
			'figure',
			'font',
			'footer',
			'form',
			'frame',
			'frameset',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'head',
			'header',
			'hgroup',
			'hr',
			'html',
			'i',
			'iframe',
			'image',
			'img',
			'input',
			'ins',
			'kbd',
			'keygen',
			'label',
			'legend',
			'li',
			'link',
			'main',
			'map',
			'mark',
			'marquee',
			'menu',
			'menuitem',
			'meta',
			'meter',
			'nav',
			'nobr',
			'noembed',
			'noframes',
			'noscript',
			'object',
			'ol',
			'optgroup',
			'option',
			'output',
			'p',
			'param',
			'picture',
			'plaintext',
			'portal',
			'pre',
			'progress',
			'q',
			'rb',
			'rp',
			'rt',
			'rtc',
			'ruby',
			's',
			'samp',
			'script',
			'section',
			'select',
			'shadow',
			'slot',
			'small',
			'source',
			'spacer',
			'span',
			'strike',
			'strong',
			'style',
			'sub',
			'summary',
			'sup',
			'table',
			'tbody',
			'td',
			'template',
			'textarea',
			'tfoot',
			'th',
			'thead',
			'time',
			'title',
			'tr',
			'track',
			'tt',
			'u',
			'ul',
			'var',
			'video',
			'wbr',
			'xmp',
		]
			.map((i: string) => `<${i}>${i}</${i}>`)
			.join(' ')
	},
})

// ====================================
// Markdown

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
	name: 'MarkdownHeading5',
	description: 'Make the text the fifth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `##### ${input}`
	},
})

pack.addFormula({
	name: 'MarkdownHeading6',
	description: 'Make the text the sixth level header',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `###### ${input}`
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
		'Make the text render with a line through it, as if it has been cancelled out',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `~~${input}~~`
	},
})

pack.addFormula({
	name: 'MarkdownCodeInline',
	description: 'Make the text render as inline code',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return `\`${input}\``
	},
})

pack.addFormula({
	name: 'MarkdownCodeBlock',
	description: 'Make the text render as a code block',
	parameters: [UnformattedTextParam, CodaBlockLanguageParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input, language]: [string, string?], context) {
		return '```' + ` ${language}\n${input}\n` + '```'
	},
})

pack.addFormula({
	name: 'MarkdownQuote',
	description: 'Make each line of text render as the same quote',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '> ' + input.replace(/\n/g, '\n> ')
	},
})

pack.addFormula({
	name: 'MarkdownUnorderedList',
	description: 'Make each line of text render as an unordered list item',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '* ' + input.replace(/\n/g, '\n* ')
	},
})

pack.addFormula({
	name: 'MarkdownOrderedList',
	description: 'Make each line of text render as an ordered list item',
	parameters: [UnformattedTextParam],
	resultType: coda.ValueType.String,
	codaType: coda.ValueHintType.Markdown,
	execute: async function ([input]: [string], context) {
		return '1. ' + input.replace(/\n/g, '\n1. ')
	},
})
