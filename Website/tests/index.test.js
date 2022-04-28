import chai, { should, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test index page", () => {
	describe("GET /", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});
});
