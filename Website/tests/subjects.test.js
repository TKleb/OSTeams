import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";

chai.should();
chai.use(chaiHttp);

const userCredentials = {
	"email":"default.user@ost.ch",
	"password":"password"
}

var authenticatedUser = request.agent(server);

before( async () => {
	authenticatedUser
	.post("/account/login")
	.type("form")
	.send(userCredentials)
	.end((err, response) => {
		expect('Location', '/');
	})
});

describe("Test subjects page", () => {
	describe("GET /subjects", () => {
		it("It should load the page", async () => {
			authenticatedUser
				.get("/subjects")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					assert.match(res.text, /Subjects/);
				});
		});
	});
});
