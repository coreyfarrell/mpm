import path from 'path';
import {readFileSync} from 'fs';
import {createRequire} from 'module';
import {fileURLToPath, pathToFileURL} from 'url';

import {specifierPackage} from './specifier-package.js';

export class LoadMappings {
	#topScopeURL;
	#topScopeDirectory;
	#topScope = {};
	#nodeModulesURL;
	#nodeModulesScopes = {};
	#links = {};

	constructor() {
		const main = process.mainModule || process.argv[1] || path.resolve(process.cwd(), '[main]');

		const mappingsFile = createRequire(main).resolve('mappings.json');
		this.#nodeModulesURL = pathToFileURL(path.dirname(mappingsFile)).href;
		this.#topScopeDirectory = path.resolve(path.dirname(mappingsFile), '..');
		this.#topScopeURL = pathToFileURL(this.#topScopeDirectory).href;
		try {
			const raw = JSON.parse(readFileSync(mappingsFile, 'utf8'));
			this.#topScope = raw.mappings || {};
			this.#nodeModulesScopes = raw.scoped || {};
			this.#links = raw.links || {};
		} catch {
		}
	}

	findScope(sourceURL) {
		if (!sourceURL) {
			return;
		}

		if (sourceURL.startsWith(this.#nodeModulesURL)) {
			return this.#nodeModulesScopes[
				specifierPackage(sourceURL.slice(this.#nodeModulesURL.length + 1))
			];
		}

		const linkID = path.relative(this.#topScopeDirectory, path.dirname(fileURLToPath(sourceURL)));
		if (linkID in this.#links) {
			return this.#nodeModulesScopes[this.#links[linkID]];
		}

		if (sourceURL.startsWith(this.#topScopeURL)) {
			return this.#topScope;
		}
	}
}
