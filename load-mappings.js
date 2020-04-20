import path from 'path';
import {readFileSync} from 'fs';
import {createRequire} from 'module';
import {pathToFileURL} from 'url';

import {specifierPackage} from './specifier-package.js';

export class LoadMappings {
	#topScopeDirectory;
	#topScope = {};
	#nodeModulesDirectory;
	#nodeModulesScopes = {};

	constructor() {
		const main = process.mainModule || process.argv[1] || path.resolve(process.cwd(), '[main]');

		const mappingsFile = createRequire(main).resolve('mappings.json');
		this.#nodeModulesDirectory = pathToFileURL(path.dirname(mappingsFile)).href;
		this.#topScopeDirectory = pathToFileURL(path.resolve(path.dirname(mappingsFile), '..')).href;
		try {
			const raw = JSON.parse(readFileSync(mappingsFile, 'utf8'));
			this.#topScope = raw.mappings || {};
			this.#nodeModulesScopes = raw.scoped || {};
		} catch {
		}
	}

	findScope(sourceURL) {
		if (!sourceURL) {
			return;
		}

		if (sourceURL.startsWith(this.#nodeModulesDirectory)) {
			return this.#nodeModulesScopes[
				specifierPackage(sourceURL.slice(this.#nodeModulesDirectory.length + 1))
			];
		}

		if (sourceURL.startsWith(this.#topScopeDirectory)) {
			return this.#topScope;
		}
	}
}
