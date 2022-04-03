import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test module page", () => {
	describe("GET /module", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/module")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});

	describe("POST /module", () => {
		it("It should get a list of all modules.", (done) => {
			chai.request(server)
				.post("/module")
				.end((err, response) => {
					response.should.have.status(200);
				});

			done();
		});
	});
});
