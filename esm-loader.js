import {fileURLToPath} from 'url';

import {rewriteSpecifier} from './rewrite-specifier.js';

const requireParent = JSON.stringify(fileURLToPath(import.meta.url));
export const getGlobalPreloadCode = () => `getBuiltin('module').createRequire(${requireParent})('./bundled-loader.cjs');`;

export async function resolve(specifier, context, defaultResolve) {
	return defaultResolve(
		rewriteSpecifier(specifier, context.parentURL),
		context,
		defaultResolve
	);
}
