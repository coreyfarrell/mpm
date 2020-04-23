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

			const {name, resolved, isLink, target, realpath, package: {version}} = child;
			const fullId = `${name}@${version}`;

			this.set(name, inventory.findOrCreate(fullId, () => ({
				fullId,
				resolved,
				mappings: new Mappings(inventory, isLink ? target : child),
				tar: doFetch && !isLink ? fetch(resolved) : null,
				realpath: isLink ? realpath : null
			})));
		}
	}

	getMappings() {
		return Object.fromEntries([...this.entries()].map(([id, {fullId}]) => [id, fullId]));
	}
}
