import {builtinModules} from 'module';

export function isBareSpecifier(specifier) {
	return !builtinModules.includes(specifier) &&
		!specifier.startsWith('./') &&
		!specifier.startsWith('../') &&
		!specifier.startsWith('file://');
}
