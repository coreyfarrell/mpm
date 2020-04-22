import t from 'libtap';
import makeDir from 'linked-package2';
import direct from '../node_modules/make-dir@3.1.0/index.js';

t.equal(makeDir, direct, {skip: 'skip due to @npmcli/arborist not resolving dependencies of linked packages'});
