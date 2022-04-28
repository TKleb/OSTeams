import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test account page", () => {
	describe("GET /account/", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/account")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});

	describe("GET /account/logout", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/account/logout")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});

	describe("GET /account/edit", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/account/edit")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});
});
