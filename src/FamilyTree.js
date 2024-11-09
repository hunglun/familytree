
// Person class as a singleton with a name
export class Person {
	constructor(name) {
		this.name = name;
	}
}

// Relationship class for a (person1, person2, relation) triple
export class Relationship {
	constructor(person1, person2, relation) {
		this.person1 = person1;
		this.person2 = person2;
		this.relation = relation;
	}
}

// FamilyTree class to manage relationships and related functions
export class FamilyTree {
	constructor() {
		this.relationships = new Set();
		this.people = new Map(); // Map of people for quick access
	}

	// Adds a relationship to the family tree if it's valid
	addRelationship(rel) {
		if (!["parent", "partner"].includes(rel.relation)) {
			if (rel.relation == null) {

				throw new Error("Invalid relation type: null");
			} else {
				throw new Error("Invalid relation type", rel.relation);

			}
		}
		this.relationships.add(rel);
		this.people.set(rel.person1.name, rel.person1);
		this.people.set(rel.person2.name, rel.person2);
		return this;
	}

	// Removes a person from the family tree and all associated relationships
	removePerson(name) {
		this.relationships = new Set([...this.relationships].filter(
			rel => rel.person1.name !== name && rel.person2.name !== name
		));
		this.people.delete(name);
		return this;
	}

	// Edits a person by replacing with a new instance
	editPerson(name, new_name) {
		if (!this.people.has(name)) {
			throw new Error("Person not found in the tree");
		}
		this.relationships = new Set([...this.relationships].map(
			// change the name of the person in the relationship
			rel => {
				if (rel.person1.name === name) {
					rel.person1.name = new_name;
					this.people.delete(name);
					this.people.set(new_name, rel.person1);
				} else if (rel.person2.name === name) {
					rel.person2.name = new_name;
					this.people.delete(name);
					this.people.set(new_name, rel.person2);
				}
				return rel;
			}
		));

		return this;
	}

	getRelationPath(name1, name2) {
		// Check if either person is not in the family tree
		if (!this.people.has(name1) || !this.people.has(name2)) {
			return null;
		}

		// BFS to find the path between name1 and name2
		const queue = [[name1]];
		const visited = new Set();
		visited.add(name1);

		// Map to keep track of relationships used in the path
		const relationshipMap = new Map();

		while (queue.length > 0) {
			const path = queue.shift();
			const person = path[path.length - 1];

			if (person === name2) {
				// Found a path, now reconstruct the FamilyTree for it
				const relationTree = new FamilyTree();
				for (let i = 0; i < path.length - 1; i++) {
					const p1 = path[i];
					const p2 = path[i + 1];
					var relation = relationshipMap.get(`${p1}-${p2}`);
					if (relation == null) {
						relation = relationshipMap.get(`${p2}-${p1}`);
						relationTree.addRelationship(new Relationship(this.people.get(p2), this.people.get(p1), relation));

					} else {
						relationTree.addRelationship(new Relationship(this.people.get(p1), this.people.get(p2), relation));

					}
					if (relation == null) {
						throw new Error("Invalid relation type: null for ", p1, p2);
					}
				}
				return relationTree;
			}

			// Explore neighbors (connected persons) through relationships
			for (let rel of this.relationships) {
				let neighbor = null;
				if (rel.person1.name === person && !visited.has(rel.person2.name)) {
					neighbor = rel.person2.name;
					relationshipMap.set(`${person}-${neighbor}`, rel.relation);
				} else if (rel.person2.name === person && !visited.has(rel.person1.name)) {
					neighbor = rel.person1.name;
					relationshipMap.set(`${neighbor}-${person}`, rel.relation);
				}

				if (neighbor) {
					visited.add(neighbor);
					queue.push([...path, neighbor]);
				}
			}
		}

		return null; // No path found
	}

	// Retrieves the relationship between two people if it exists
	getDirectRelation(name1, name2) {
		for (let rel of this.relationships) {
			if ((rel.person1.name === name1 && rel.person2.name === name2) ||
				(rel.person2.name === name1 && rel.person1.name === name2)) {
				return rel.relation;
			}
		}
		return null;
	}

	// Checks if two people are related directly or indirectly
	isRelated(name1, name2, visited = new Set()) {
		if (name1 === name2) return true;
		visited.add(name1);
		for (let rel of this.relationships) {
			let neighbor = null;
			if (rel.person1.name === name1 && !visited.has(rel.person2.name)) {
				neighbor = rel.person2.name;
			} else if (rel.person2.name === name1 && !visited.has(rel.person1.name)) {
				neighbor = rel.person1.name;
			}
			if (neighbor && this.isRelated(neighbor, name2, visited)) {
				return true;
			}
		}
		return false;
	}

	// Loads family tree data from JSON
	static loadData(jsonData) {
		const familyTree = new FamilyTree();
		jsonData.forEach(({ person1, person2, relation }) => {
			const p1 = familyTree.people.get(person1) || new Person(person1);
			const p2 = familyTree.people.get(person2) || new Person(person2);
			familyTree.addRelationship(new Relationship(p1, p2, relation));
		});
		return familyTree;
	}

	// Converts family tree to JSON for saving
	saveData() {
		return JSON.stringify([...this.relationships].map(rel => ({
			person1: rel.person1.name,
			person2: rel.person2.name,
			relation: rel.relation
		})));
	}

	// Display the family tree
	display() {
		this.relationships.forEach(rel => {
			console.log(`${rel.person1.name} -(${rel.relation})-> ${rel.person2.name}`);
		});
	}
}