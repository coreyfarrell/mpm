import assert from 'assert';
import * as uhandlers from 'uhandlers';
import * as relImport from './node_modules/uhandlers@0.2.0/esm/index.js';

assert.strictEqual(uhandlers, relImport);
