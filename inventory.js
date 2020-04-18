export class Inventory extends Map {
	findOrCreate(id, create) {
		if (this.has(id)) {
			return this.get(id);
		}

		const value = create();
		this.set(id, value);

		return value;
	}
}
