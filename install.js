#!/usr/bin/env node
import {Tree} from './lib/tree.js';

const tree = new Tree();
tree.build().catch(error => {
	console.error(error);
	process.exit(1);
});
