/* eslint no-await-in-loop: 0 */

import path from 'path';
import {promises as fs} from 'fs';

import Arborist from '@npmcli/arborist';
import tar from 'tar';

import {Inventory} from './inventory.js';
import {Mappings} from './mappings.js';

export class Tree {
	#arborist = new Arborist();
	#inventory;
	#root;

	async build() {
		await this.#arborist.buildIdealTree({update: true, legacyBundling: true});
		this.#inventory = new Inventory();
		this.#root = new Mappings(this.#inventory, this.#arborist.idealTree.root);

		const rootDirectory = process.cwd();
		const nodeMap = {
			mappings: this.#root.getMappings(),
			scoped: {},
			links: {}
		};

		await fs.mkdir('node_modules', {recursive: true});
		for (const [id, item] of this.#inventory.entries()) {
			const packageDirectory = path.join('node_modules', id);
			if (!item.tar) {
				if (item.realpath) {
					await fs.mkdir(path.dirname(packageDirectory), {recursive: true});
					await fs.symlink(item.realpath, path.resolve(packageDirectory));
					nodeMap.links[path.relative(rootDirectory, item.realpath)] = id;
				}

				continue;
			}

			await fs.mkdir(packageDirectory, {recursive: true});
			const response = await item.tar;
			if (!response.ok) {
				throw new Error(`[${item.resolved}]: Unexpected response ${response.statusText}`);
			}

			response.body.pipe(tar.extract({strip: 1, cwd: packageDirectory}));
		}

		for (const [id, info] of this.#inventory.entries()) {
			if (info.mappings.size !== 0) {
				nodeMap.scoped[id] = info.mappings.getMappings();
			}
		}

		// pretty print for now to allow easier debug
		await fs.writeFile('node_modules/mappings.json', JSON.stringify(nodeMap, null, 2));
	}
}
