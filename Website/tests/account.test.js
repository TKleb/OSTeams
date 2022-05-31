import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert, { doesNotMatch } from "assert";
import request from "supertest";
import AccountController from "../controller/account-controller.js"

chai.should();
chai.use(chaiHttp);

const userCredentials = {
	"email":"hans.muster@ost.ch",
	"password":"password"
}

var authenticatedUser = request.agent(server);

before( async () => {
	authenticatedUser
	.post("/account/login")
	.type("form")
	.send(userCredentials)
	.end((err, res) => {
		expect('Location', '/');
	});
});

describe("Test account page", () => {

	describe("Test logout", () => {
		it("It should destroy the session and redirect", (done) => {
			const req = {
				session: {
					authenticatedUser,
					destroy: () => { },
				},
				params: {id: "12"},
				flash: () => {},
			};

			const res = {
				redirect: (url) => {
					if(url === "/") {
						done();
					}
				}

			};
			AccountController.logout(req, res);
		});
	});

	describe("Test index", () => {
		it("It should redirect to showAccountById", (done) => {
			const req = {
				session: { userId: 12 },
			};

			const res = {
				redirect: (url) => {
					assert.equal(url, "/account/12");
					done();
				},
			};

			AccountController.index(req, res);
		});
	});

	describe("Test edit", () => {
		it("It should show the editAccount view", (done) => {
			const req = {
				session: { email: userCredentials.email },
				flash: () => {},
			};

			const res = {
				render: (viewName, options) => {
					assert.equal(viewName, "editAccount");
					done();
				},
			};

			AccountController.edit(req, res);
		});
	});

	describe("Test showAccountById", () => {
		it("It should show the account with id 12", (done) => {
			const req = {
				params: { id: 12 },
				session: { userId: 12},
				flash: () => {},
			};

			const res = {
				render: (viewName, options) => {
					assert.equal(viewName, "account");
					done();
				},
			};

			AccountController.showAccountById(req, res);
		});

		it("It should redirect to home when providing invalid id", (done) => {
			const req = {
				params: { id: "invalid" },
				session: { userId: 12},
				flash: () => {},
			};

			const res = {
				redirect: (url) => {
					assert.equal(url, "/");
					done();
				},
			};

			AccountController.showAccountById(req, res);
		});
	});

	describe("Test update", () => {
		it("It should redirect to /account/edit on success", (done) => {
			const req = {
				session: { userId: 12 },
				body: {
					surname: "Hello",
					name: "Name",
					startYear: "2023",
					fulltime: "true",
					info: "This is my custom info",
				},
				flash: () => {},
			};

			const res = {
				redirect: (url) => {
					assert.equal(url, "/account/edit");
					done();
				},
			};

			AccountController.update(req, res);
		});

		it("It should redirect to home on error", (done) => {
			const req = {
				session: { userId: 12 },
				body: {
					surname: "Thisusernameiswaytoolongbecausethereisacharacterlimit",
					name: "Name",
					startYear: "asdasd",
					fulltime: "true",
					info: "This is my custom info",
				},
				flash: () => {},
			};

			const res = {
				redirect: (url) => {
					assert.equal(url, "/");
					done();
				},
			};

			AccountController.update(req, res);
		});
	});

	// describe("Test delete", () => {
	// 	it("It should redirect to homepage", (done) => {
	// 		const req = {
	// 			session: { userId: 12 },
	// 			flash: (type, msg) => {
	// 				assert.equal(type, "success");
	// 			},
	// 		};

	// 		const res = {
	// 			redirect: (url) => {
	// 				assert.equal(url, "/");
	// 				done();
	// 			},
	// 		};

	// 		AccountController.delete(req, res);
	// 	});

	// 	it("It should display an error", (done) => {
	// 		const req = {
	// 			session: { userId: -1 },
	// 			flash: (type, msg) => {
	// 				assert.equal(type, "error");
	// 			},
	// 		};

	// 		const res = {
	// 			redirect: (url) => {
	// 				assert.equal(url, "/");
	// 				done();
	// 			},
	// 		};

	// 		AccountController.delete(req, res);
	// 	});
	// });
});
