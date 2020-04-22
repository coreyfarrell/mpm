import t from 'libtap';
import * as uhandlers from 'uhandlers';
import * as relImport from '../node_modules/uhandlers@0.2.0/esm/index.js';

t.equal(uhandlers, relImport);
