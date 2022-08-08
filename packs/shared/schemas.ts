import * as coda from '@codahq/packs-sdk'

export const usdSchema: coda.CurrencySchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Currency,
	currencyCode: 'USD',
	precision: 2,
	// format?: CurrencyFormat;
}
export const currencySchema: coda.CurrencySchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Currency,
	precision: 2,
}
export const percentSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.Percent,
	useThousandsSeparator: true,
	precision: 2,
}
export const booleanSchema: coda.BooleanSchema = {
	type: coda.ValueType.Boolean,
}
export const minutesSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	useThousandsSeparator: true,
}
export const stringSchema: coda.StringSchema = {
	type: coda.ValueType.String,
}
export const numberSchema: coda.NumberSchema = {
	type: coda.ValueType.Number,
	useThousandsSeparator: true,
	precision: 2,
}
export const datetimeStringSchema:
	| coda.StringSchema
	| coda.StringDateTimeSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.DateTime,
}
export const datetimeNumberSchema:
	| coda.NumberSchema
	| coda.NumericDateTimeSchema = {
	type: coda.ValueType.Number,
	codaType: coda.ValueHintType.DateTime,
}
export const urlSchema: coda.StringSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.Url,
}
export const imageSchema: coda.StringSchema = {
	type: coda.ValueType.String,
	codaType: coda.ValueHintType.ImageReference,
}
export const linkSchema: coda.ArraySchema = {
	type: coda.ValueType.Array,
	items: {
		type: coda.ValueType.String,
	},
}
