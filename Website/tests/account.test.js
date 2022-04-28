import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test account page", () => {
	describe("GET /account/", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/account");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("GET /account/logout", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/account/logout");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("GET /account/edit", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/account/edit");
			assert.equal(res.statusCode, 200);
		});
	});
});
