import assert from 'assert';
import makeDir from 'linked-package2';
import direct from './node_modules/make-dir@3.0.2/index.js'

assert.strictEqual(makeDir, direct);
