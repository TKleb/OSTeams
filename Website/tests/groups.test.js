import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";

chai.should();
chai.use(chaiHttp);

const userCredentials = {
	"email":"hans.muster@ost.ch",
	"password":"password"
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

describe("Test groups page", () => {
	describe("GET /groups", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/groups");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("GET /groups/9", () => {
		it("It should get the group with the id '9'", function(done) {
			authenticatedUser
				.get("/groups/9")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/groups/9")
					done();
				});
		});
	});

	describe("GET /subjects/CN1", () => {
		it("It should show all groups user can apply to", async () => {
			authenticatedUser
				.get("/subjects/CN1")
				.end((err, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/subjects/CN1");
					assert.doesNotMatch(res.text, /Peter hackt die Welt/);
				});
		});
	});

	describe("Leave own group", () => {
		it("It should throw error: Cannot leave group.", async () => {
			authenticatedUser
				.post("/groups/leave/11")
				.end((err, res) => {
					assert.equal(res.statusCode, 200);
					assert.match(res.text, /Cannot leave group/);
				});
		});
	});

	describe("Leave group", () => {
		it("It should remove the user from the group", async () => {
			authenticatedUser
				.post("/groups/leave/10")
				.end((err, res) => {
					expect("Location", "/groups");
					assert.doesNotMatch(res.text, /Peters lustige Gruppe/);
				});
		});
	});
});


