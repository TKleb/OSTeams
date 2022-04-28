import chai, { should, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test forgot password page", () => {
	describe("GET /account/forgot", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/account/forgot")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});
});
