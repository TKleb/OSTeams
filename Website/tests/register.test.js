import chai from "chai";
import chaiHttp from "chai-http";
import assert from "assert";
import server from "../index.js";
import Chance from "chance";
import { generateToken, hashPassword } from "../controller/register-controller.js";
import pgConnector from "../services/pg-connector.js";

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
		it("It should return status code 200", async () => {
			const res = await chai.request(server)
				.post("/account/register");
			assert.equal(res.statusCode, 200);
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
			await pgConnector.addUnverifiedUser(email, hashPassword("Test12345"), token);
			const res = await chai.request(server)
				.get(`/account/verifyEmail?token=${token}`);
			assert.match(res.text, /Email verified successfully/);
			assert.equal(await pgConnector.isEmailInUse(email), true);
		});
	});
});
