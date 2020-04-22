'use strict';

const t = require('libtap');
const path = require('path');

const pify = require('pify');

const packageDirectory = path.resolve(__dirname, '..');
const expectedResolve = path.join(packageDirectory, 'node_modules', 'pify@5.0.0', 'index.js');

t.equal(
	require.cache[expectedResolve].exports,
	pify,
	'got the expected pify'
);

t.same(
	[expectedResolve, __filename].filter(item => !item.startsWith(packageDirectory)),
	[],
	'nothing loaded from outside packageDirectory'
);
