import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test login page", () => {
	describe("GET /login", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/account")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});
});
