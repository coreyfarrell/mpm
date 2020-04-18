import fetch from 'node-fetch';

export class Mappings extends Map {
	constructor(inventory, node) {
		super();

		for (const [id, {to: child}] of node.edgesOut.entries()) {
			const fullId = `${child.name}@${child.package.version}`;
			this.set(child.name, inventory.findOrCreate(fullId, () => ({
				fullId,
				resolved: child.package.resolved || child.package._resolved,
				mappings: new Mappings(inventory, child),
				tar: process.env.DO_FETCH === '1' ? fetch(resolved) : null
			})));
		}
	}

	getMappings() {
		return Object.fromEntries([...this.entries()].map(([id, {fullId}]) => [id, fullId]));
	}
}
