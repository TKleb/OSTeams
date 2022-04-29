import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import assert from "assert";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test register page", () => {
	describe("GET /account/register", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/account/register");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("POST /account/register with email and password", () => {
		it("It should Register the user", async () => {
			const res = await chai.request(server)
				.post("/account/register")
				.type("form")
				.send({
					"email":"gianlcua.nenz@ost.ch",
					"password":"Test12345"
				})
			assert.equal(res.statusCode, 200);

		});
	});

	describe("POST /account/register without body", () => {
		it("It should throw error: Please provide email and password.", async () => {
			const res = await chai.request(server)
				.post("/account/register");
			assert.equal(res.statusCode, 200);
			assert.match(res.text, /Please provide email and password./);
		});
	});
});
