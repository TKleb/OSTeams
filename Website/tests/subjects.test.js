import chai, { should, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test subjects page", () => {
	describe("GET /subjects", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/subjects")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});

	describe("POST /subjects", () => {
		it("It should get a list of all subjects.", async function() {
			const res = await chai.request(server)
				.post("/subjects")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});
});
