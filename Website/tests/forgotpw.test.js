import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test forgot password page", () => {
	describe("GET /account/forgot", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/account/forgot")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});
});
