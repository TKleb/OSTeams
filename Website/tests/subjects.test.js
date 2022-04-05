import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test subjects page", () => {
	describe("GET /subjects", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/subjects")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});

	describe("POST /subjects", () => {
		it("It should get a list of all subjects.", (done) => {
			chai.request(server)
				.post("/subjects")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});
});
