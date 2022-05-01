import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test subjects page", () => {
	describe("GET /subjects", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/subjects");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("POST /subjects", () => {
		it("It should get a list of all subjects.", async () => {
			const res = await chai.request(server)
				.post("/subjects");
			assert.equal(res.statusCode, 200);
		});
	});
});
