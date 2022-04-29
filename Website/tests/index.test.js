import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test index page", () => {
	describe("GET /", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/");
			assert.equal(res.statusCode, 200);
		});
	});
});
