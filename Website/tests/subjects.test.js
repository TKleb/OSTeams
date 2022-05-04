import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";

chai.should();
chai.use(chaiHttp);

const userCredentials = {
	"email":"test@123.ch",
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

	describe("POST empty /subjects/add", () => {
		it("It should throw error: Please provide an Abbreviation and a Subject name.", function(done) {
			authenticatedUser
				.post("/subjects/add")
				.type("form")
				.send({
					"abbr":"",
					"subName":""
				})
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					assert.match(res.text, /Please provide an Abbreviation and a Subject name./);
					done();
				});
		});
	});

	describe("POST /subjects/add", () => {
		it("It should add the subject test1", function(done) {
			authenticatedUser
				.post("/subjects/add")
				.type("form")
				.send({
					"abbr":"ts1",
					"subName":"test1"
				})
				done();
		});
	});

	describe("POST /subjects", () => {
		it("It should test if 'test1' subject was created", function(done) {
			authenticatedUser
				.post("/subjects")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					assert.match(res.text, /test1/);
					done();
				});
		});
	});

	describe("GET /subjects", () => {
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
