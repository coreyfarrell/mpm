import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'libtap';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const tests = ['commonjs.cjs', 'esm.js', 'linked1.js', 'linked2.js'];

process.env.NODE_OPTIONS = [].concat(
	process.env.NODE_OPTIONS || [],
	`--experimental-loader=${path.resolve(testDirectory, '..', '..', 'bundled-loader.js')}`,
	'--no-warnings'
).join(' ');

for (const test of tests) {
	spawn(process.execPath, [`${testDirectory}/${test}`], test);
}
