import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";


chai.should();
chai.use(chaiHttp);

describe("Test login page", () => {
	describe("GET /login", () => {
		it("It should Load the page.", async() => {
			const res = await chai.request(server)
				.get("/account/login");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("POST /login", () => {
		it("It should log in a user.", async() => {
			const res = await chai.request(server)
				.get("/account/login");
			assert.equal(res.statusCode, 200);
		});
	});
});
