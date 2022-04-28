import chai, { should, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";

chai.should();
chai.use(chaiHttp);

describe("Test account page", () => {
	describe("GET /account/", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/account")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});

	describe("GET /account/logout", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/account/logout")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});

	describe("GET /account/edit", () => {
		it("It should Load the page.", async function() {
			const res = await chai.request(server)
				.get("/account/edit")
				.send();
			assert.equal(res.statusCode, 200);
		});
	});
});
