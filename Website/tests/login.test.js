import chai, {expect} from "chai";
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
		it("It should throw error: Please provide email and password.", async() => {
			const res = await chai.request(server)
				.post("/account/login")
			assert.equal(res.statusCode, 200);
			assert.match(res.text, /Please provide email and password/)
		});
	});

	// works, but commented out since there is no such user, in register.test.js this user needs to be created, which can't be tested right now
	// since we can't test the generation of the token. see jira issue 321
/*	describe("POST /login", () => {
		it("It should log in a user", async() => {
			const res = await chai.request(server)
				.post("/account/login")
				.type("form")
				.send({
					"email":"test@123.ch",
					"password":"Test12345"
				})
			assert.equal(res.statusCode, 200);
		});
	});
*/
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


});
