import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";

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
		it("It should throw error: Please provide email and password.", async() => {
			const res = await chai.request(server)
				.post("/account/login")
			assert.equal(res.statusCode, 200);
			assert.match(res.text, /Please provide email and password/)
		});
	});

	describe("POST /login with invalid credentials", () => {
		it("It should throw error: Invalid credentials.", async () => {
			const res = await chai.request(server)
				.post("/account/login")
				.type("form")
				.send({
					"email":"doesntexist@ost.ch",
					"password":"Test12345"
				})
			assert.equal(res.statusCode, 200);
			assert.match(res.text, /Invalid credentials/);
		});
	});

	describe("POST /login", () => {
		it("It should log in a user", async() => {
			const res = await request.agent(server)
				.post("/account/login")
				.type("form")
				.send({
					"email":"default.user@ost.ch",
					"password":"password"
				})
			assert.equal(res.statusCode, 302);
			expect("Location", "/");
		});
	});
});
