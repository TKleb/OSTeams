import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test index page", () => {
	describe("GET /", () => {
		it("It should Load the page.", () => {
			chai.request(server)
				.get("/")
				.end((err, response) => {
					expect(response).to.not.be.undefined;
					response.should.have.status(200);
				});
		});
	});
});
