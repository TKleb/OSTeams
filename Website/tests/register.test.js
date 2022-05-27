import chai from "chai";
import chaiHttp from "chai-http";
import assert from "assert";
import server from "../index.js";
import Chance from "chance";
import { generateToken, hashPassword, addUnverifiedUserToDB, checkEmailUsed } from "../controller/register-controller.js";

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

	describe("POST /account/register without body", () => {
		it("It should throw error: Please provide email and password.", async () => {
			const res = await chai.request(server)
				.post("/account/register");
			assert.equal(res.statusCode, 200);
			assert.match(res.text, /Please provide email and password./);
		});
	});

	describe("Generate verification token", () => {
		it("It should generate a verification token.", async () => {
			assert.equal(generateToken().length, 50);
		});
	});

	describe("Create and verify new user", () => {
		it("It should create and verify a new user.", async () => {
			const token = generateToken();
			const email = Chance().email({ domain: "ost.ch", length: 20 });
			await addUnverifiedUserToDB(email, hashPassword("Test12345"), token);
			const res = await chai.request(server)
				.get(`/account/verifyEmail?token=${token}`);
			assert.match(res.text, /Email verified successfully/);
			assert.equal(await checkEmailUsed(email), true);
		});
	});
});
