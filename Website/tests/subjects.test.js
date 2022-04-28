import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test subjects page", () => {
	describe("GET /subjects", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/subjects")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});

	describe("POST /subjects", () => {
		it("It should get a list of all subjects.", () => {
			chai.request(server)
				.post("/subjects")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});
});
