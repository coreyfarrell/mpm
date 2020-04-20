'use strict';

const assert = require('assert');
const path = require('path');

const pify = require('pify');

const expectedResolve = path.join(__dirname, 'node_modules', 'pify@5.0.0', 'index.js');
assert.strictEqual(
	require.cache[expectedResolve].exports,
	pify
);
assert.deepStrictEqual(
	[expectedResolve, __filename].sort(),
	Object.keys(require.cache).sort()
);
