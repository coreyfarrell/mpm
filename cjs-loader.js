import module from 'module';
import {pathToFileURL} from 'url';

import {rewriteSpecifier} from './rewrite-specifier.js';

const modulePatchedBy = Symbol.for(`_resolveFilename:patchedBy:${__dirname}`);

delete require.cache[__filename];

if (!module[modulePatchedBy]) {
	Object.defineProperty(module, modulePatchedBy, {value: true});

	const orig = module._resolveFilename;

	module._resolveFilename = (...args) => {
		const [request, parent] = args;
		args[0] = rewriteSpecifier(
			request,
			parent && parent.filename && pathToFileURL(parent.filename).href
		);

		return orig.apply(module, args);
	};
}
