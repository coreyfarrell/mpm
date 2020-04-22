import fetch from 'node-fetch';

export class Mappings extends Map {
	constructor(inventory, node) {
		super();

		const doFetch = process.env.DO_FETCH !== '0';
		for (const edge of node.edgesOut.values()) {
			const {to: child} = edge;
			if (!child) {
				// linked-package2 -> is-array has gives null here
				console.log(`${node.name} error for ${edge.name}`);

				continue;
			}

			const resolved = child.package.resolved || child.package._resolved;
			const fullId = `${child.name}@${child.package.version}`;

			this.set(child.name, inventory.findOrCreate(fullId, () => ({
				fullId,
				resolved,
				mappings: new Mappings(inventory, child.isLink ? child.target : child),
				tar: doFetch && resolved ? fetch(resolved) : null,
				realpath: resolved ? null : child.realpath
			})));
		}
	}

	getMappings() {
		return Object.fromEntries([...this.entries()].map(([id, {fullId}]) => [id, fullId]));
	}
}
