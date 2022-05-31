import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";
import {attachDeadlineDisplay, getApplicationsToGroupForDisplay} from "../controller/groups-controller.js";

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

describe("Test groups page", () => {
	describe("GET /groups", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/groups");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("attachDeadlineDisplay", () => {
		it("It should attach Deadline to Group", async () => {
			const group = {
				id: '123',
				owner_id: '9999',
				name: 'Test Group',
				description: 'Test Group',
				apply_by_date: '2022-07-11'};
			const groupWithDeadline = attachDeadlineDisplay(group);
			assert.equal(groupWithDeadline.deadlineDisplay, '11 July 2022');
		});
	});

	describe("getApplicationsToGroupForDisplay", () => {
		it("It should get all applications for a group", async () => {
			const application = await getApplicationsToGroupForDisplay(9);
			const application_id = 2;
			assert.equal(application_id, application[0].id);
		});
	});

	describe("GET /groups/9", () => {
		it("It should get the group with the id '9'", async () => {
			authenticatedUser
				.get("/groups/9")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/groups/9")
				});
		});
	});

	describe("GET /subjects/CN1", () => {
		it("It should show all groups user can apply to", async () => {
			authenticatedUser
				.get("/subjects/CN1")
				.end((err, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/subjects/CN1");
					assert.doesNotMatch(res.text, /hans.muster@ost.ch/);
				});
		});
	});

	describe("Leave own group", () => {
		it("It should not allow a group owner to leave their own group.", async () => {
			authenticatedUser
				.post("/groups/leave/11")
				.end((err, res) => {
					assert.equal(res.statusCode, 200);
					assert.match(res.text, /Cannot leave group/);
				});
		});
	});

	describe("Leave group", () => {
		it("It should remove the user from the group", async () => {
			authenticatedUser
				.post("/groups/leave/10")
				.end((err, res) => {
					expect("Location", "/groups");
					assert.doesNotMatch(res.text, /Peters lustige Gruppe/);
				});
		});
	});
});


