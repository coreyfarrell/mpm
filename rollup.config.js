const external = [
	'fs',
	'module',
	'path',
	'url'
];

export default [
	{
		input: 'cjs-loader.js',
		external,
		output: {
			file: 'bundled-loader.cjs',
			interop: false,
			format: 'cjs'
		}
	},
	{
		input: 'esm-loader.js',
		external,
		output: {
			file: 'bundled-loader.js'
		}
	}
];
