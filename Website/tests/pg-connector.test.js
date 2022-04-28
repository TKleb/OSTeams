import { expect } from "chai";
import pgConnector from "../services/pg-connector.js";

describe("Test PG-Connector", () => {
	describe("Test getting all subjects", () => {
		it("It should return a list of subjects", (done) => {
			pgConnector.executeStoredProcedure("get_subjects")
				.then((subjects) => {
					expect(subjects).to.not.be.undefined;
					expect(subjects).to.be.an("array");
					expect(subjects).to.not.be.empty;
					expect(subjects[0]).to.be.an("object");
					expect(subjects[0]).to.have.property("abbreviation");
					expect(subjects[0]).to.have.property("id");
					expect(subjects[0]).to.have.property("name");
					done();
				})
				.catch(done);
		});
	});

	describe("Test passing invalid stored procedure name", () => {
		it("It should throw an exception", async () => {
			expect(pgConnector.executeStoredProcedure).to.throw();
		});
	});
});
