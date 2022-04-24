import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";

chai.should();
chai.use(chaiHttp);

describe("Test register page", () => {
	describe("GET /account/register", () => {
		it("It should Load the page.", (done) => {
			chai.request(server)
				.get("/account/register")
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});

	describe("POST /account/register with email and password", () => {
		it("It should Register the user", (done) => {
			chai.request(server)
				.post("/account/register")
				.type("form")
				.send({
					"email":"gianlcua.nenz@ost.ch",
					"password":"Test12345"
				})
				.end((err, response) => {
					response.should.have.status(200);
				});
			done();
		});
	});

	describe("POST /account/register without body", () => {
		it("It should throw error: Please provide email and password.", (done) => {
			chai.request(server)
				.post("/account/register")
				.end((err, response) => {
					response.should.have.status(200);
					response.res.text.should.contain("Please provide email and password.");
				});
			done();
		});
	});
});
