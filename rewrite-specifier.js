import module from 'module';
import {LoadMappings} from './load-mappings.js';
import {isBareSpecifier} from './is-bare-specifier.js';
import {specifierPackage} from './specifier-package.js';

const moduleMappings = Symbol.for('@coreyfarrell/mpm:mappings');
if (!module[moduleMappings]) {
	Object.defineProperty(module, moduleMappings, {value: new LoadMappings()});
}

const mappings = module[moduleMappings];

export function rewriteSpecifier(specifier, parentURL) {
	const sourceScope = mappings.findScope(parentURL);
	if (sourceScope && isBareSpecifier(specifier)) {
		const importPackage = specifierPackage(specifier);
		if (importPackage in sourceScope) {
			return [].concat(
				sourceScope[importPackage],
				specifier.slice(importPackage.length + 1) || []
			).join('/');
		}
	}

	return specifier;
}
