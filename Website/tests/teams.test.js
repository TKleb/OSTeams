import chai, { should, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test teams page", () => {
	describe("GET /teams", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/teams")
				.end((err, response) => {
					expect(response).to.have.status(200);
				});
			done();
		});
	});
});
