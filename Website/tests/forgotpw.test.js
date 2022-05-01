import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test forgot password page", () => {
	describe("GET /account/forgot", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/account/forgot");
			assert.equal(res.statusCode, 200);
		});
	});
});
