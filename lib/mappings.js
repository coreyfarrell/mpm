import fetch from 'node-fetch';

export class Mappings extends Map {
	constructor(inventory, node) {
		super();

		const doFetch = process.env.DO_FETCH !== '0';
		for (const {to: child} of node.edgesOut.values()) {
			const resolved = child.package.resolved || child.package._resolved;
			const fullId = `${child.name}@${child.package.version}`;
			this.set(child.name, inventory.findOrCreate(fullId, () => ({
				fullId,
				resolved,
				mappings: new Mappings(inventory, child),
				tar: doFetch ? fetch(resolved) : null
			})));
		}
	}

	getMappings() {
		return Object.fromEntries([...this.entries()].map(([id, {fullId}]) => [id, fullId]));
	}
}
