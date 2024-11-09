const expect = require('chai').expect;
const FamilyTree = require('../src/FamilyTree').FamilyTree; // Adjust the path as needed
const Person = require('../src/FamilyTree').Person; // Adjust the path as needed
const Relationship = require('../src/FamilyTree').Relationship;
describe('FamilyTree', () => {
	let familyTree;

	beforeEach(() => {
		familyTree = new FamilyTree();
		const Leo = new Person("Leo");
		const tiva = new Person("Tiva");
		const Jack = new Person("Jack");
		const Ken = new Person("Ken");
		const Chang = new Person("Chang");
		const Thai = new Person("Thai");
		const Steven = new Person("Steven");

		// Sample relationships
		const rel1 = new Relationship(Leo, tiva, "parent");
		const rel2 = new Relationship(Jack, Ken, "parent");
		const rel3 = new Relationship(Chang, Jack, "parent");
		const rel4 = new Relationship(Thai, Chang, "parent");
		const rel5 = new Relationship(Thai, Steven, "parent");
		const rel6 = new Relationship(Steven, Leo, "parent");

		// Family tree
		familyTree.addRelationship(rel1)
			.addRelationship(rel2)
			.addRelationship(rel3)
			.addRelationship(rel4)
			.addRelationship(rel5)
			.addRelationship(rel6);
	});

	it('should update person correctly', () => {

		expect(familyTree.people.has("Leo")).to.be.true;
		familyTree.editPerson("Leo", "Leo Updated");
		expect(familyTree.people.has("Leo")).to.be.false;
		expect(familyTree.people.has("Leo Updated")).to.be.true;
		expect(familyTree.isRelated("Leo Updated", "Tiva")).to.be.true;
		familyTree.display();
	});

	it('should get correct relation', () => {
		expect(familyTree.getDirectRelation("Leo", "Tiva")).to.equal("parent");
		expect(familyTree.getDirectRelation("Leo", "Ken")).to.be.null;
	});

	it('should check if people are related', () => {
		expect(familyTree.isRelated("Leo", "Tiva")).to.be.true;
		expect(familyTree.isRelated("Leo", "Ken")).to.be.true;
		expect(familyTree.isRelated("Leo", "Nonexistent Person")).to.be.false;
	});

	it('should load and save data correctly', () => {
		const jsonData = [
			{ person1: "Leo", person2: "Tiva", relation: "parent" },
			{ person1: "Jack", person2: "Ken", relation: "parent" }
		];
		const loadedFamilyTree = FamilyTree.loadData(jsonData);
		expect(loadedFamilyTree.relationships.size).to.equal(2);
		expect(loadedFamilyTree.saveData()).to.be.a('string');
		console.log(loadedFamilyTree.saveData());
	});

	it('should return null if either person is not in the family tree', () => {
        expect(familyTree.getRelationPath("Nonexistent Person", "Another Nonexistent Person")).to.be.null;
    });


    it('should return the correct relationship path between two people', () => {
        // Test the relationship path
        const path = familyTree.getRelationPath("Leo", "Ken");
		path.display();
	});

	it('should display family tree', () => {
		// Assuming display method prints to console, you might need to mock console.log
		familyTree.display();
		// Add assertions if display method returns a value
	});
});