import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";

chai.should();
chai.use(chaiHttp);

const userCredentials = {
	"email":"user1@verified.ch",
	"password":"Test12345"
}

var authenticatedUser = request.agent(server);

before( function(done) {
	authenticatedUser
	.post("/account/login")
	.type("form")
	.send(userCredentials)
	.end(function(err, response) {
		expect('Location', '/');
		done();
	})
});

describe("Test subjects page", () => {
	describe("POST /subjects", () => {
		it("It should load all subjects.", function(done) {
			authenticatedUser
			.post("/subjects")
			.end((error, res) => {
				assert.match(res.text, /Subjects/);
				done();
			});
		});
	});

	describe("GET /subjects", function(done) {
		it("It should load the page", function(done) {
			authenticatedUser
				.get("/subjects")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/subjects");
					done();
				});
		});
	});
});
