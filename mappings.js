import path from 'path';

import fetch from 'node-fetch';

const getScope = id => id.startsWith('@') ? id.split('/')[0] : '';

export class Mappings extends Map {
	constructor(inventory, children) {
		super();

		for (const [id, child] of children.entries()) {
			const {version} = child.package;
			const resolved = child.package.resolved || child.package._resolved;
			const fullId = `${child.name}@${version}`;
			this.set(child.name, inventory.findOrCreate(fullId, () => ({
				id,
				fullId,
				version,
				resolved,
				mappings: new Mappings(inventory, child.children, id),
				tar: fetch(resolved)
			})));
		}
	}

	getMappings(parentId = '') {
		const mappings = {};
		const parentScope = getScope(parentId);

		for (const [id, info] of this.entries()) {
			const scope = getScope(info.fullId);
			if (scope && scope === parentScope) {
				mappings[id] = path.posix.join('..', info.fullId.split('/')[1]);
			} else {
				mappings[id] = path.posix.join(parentId.replace(/[^/]+/gu, '..'), info.fullId);
			}
		}

		return mappings;
	}
}
