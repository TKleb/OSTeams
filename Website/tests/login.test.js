import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test login page", () => {
	describe("GET /login", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/account/login")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});

	describe("POST /login", () => {
		it("It should log in a user.", () => {
			chai.request(server)
				.post("/account/login")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});
});
