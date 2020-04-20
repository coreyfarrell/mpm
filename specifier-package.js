'use strict';

export const specifierPackage = specifier => specifier.split('/', specifier[0] === '@' ? 2 : 1).join('/');
