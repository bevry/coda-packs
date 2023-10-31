import * as coda from '@codahq/packs-sdk'
export const pack = coda.newPack()

pack.addFormula({
	name: 'MiddleNumber',
	description: 'Returns the middle item in a list of numbers.',
	parameters: [
		coda.makeParameter({
			type: coda.ParameterType.NumberArray,
			name: 'numbers',
			description: 'The numbers to perform the calculation on.',
		}),
	],
	resultType: coda.ValueType.Number,
	execute: async function ([list]) {
		if (list.length === 0) {
			throw new coda.UserVisibleError('The list cannot be empty.')
		}
		return list[Math.floor(list.length / 2)]
	},
})

pack.addFormula({
	name: 'MiddleAverageNumber',
	description: 'Returns the middle average number in a list of numbers.',
	parameters: [
		coda.makeParameter({
			type: coda.ParameterType.NumberArray,
			name: 'numbers',
			description: 'The numbers to perform the calculation on.',
		}),
	],
	resultType: coda.ValueType.Number,
	execute: async function ([list]) {
		if (list.length === 0) {
			throw new coda.UserVisibleError('The list cannot be empty.')
		}
		const sublist = list.slice(
			Math.floor(list.length / 3),
			Math.ceil((list.length / 3) * 2),
		)
		return sublist.reduce((a, b) => a + b, 0) / sublist.length
	},
})
