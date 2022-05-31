import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import assert from "assert";
import request from "supertest";
import {attachDeadlineDisplay, getApplicationsToGroupForDisplay, userLeaveGroup} from "../controller/groups-controller.js";
import GroupsController from "../controller/groups-controller.js"

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

	describe("Close Application", () => {
		it("It should close the application", function (done){
			const req = {
				session: {userId: 14},
				params: {applicationId: 3, groupId: 10},
				body: {
					accept: "true",
				},
				flash: (status) => {
					if (status === "success"){
						done();
					}
				},
			};
			const res = {
				redirect: () => {},
			};
			GroupsController.closeApplication(req, res);
		});
	});

	describe("GET /groups", () => {
		it("It should Load the page.", async () => {
			const res = await chai.request(server)
				.get("/groups");
			assert.equal(res.statusCode, 200);
		});
	});

	describe("attach Deadline Display", () => {
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

	describe("Get Applications To Group For Display", () => {
		it("It should get all applications for a group", async () => {
			const application = await getApplicationsToGroupForDisplay(9);
			const application_id = 2;
			assert.equal(application_id, application[0].id);
		});
	});

	describe("Leave group function", () => {
		it("It should leave the group", function (done){
			const req = {
				session: authenticatedUser,
				flash: (status) => {
					if (status === "success"){
						done();
					}
				},
			};
			const res = {redirect: () => {}};
			userLeaveGroup(req, 10, res);
		});
	});

	describe("Show groups of subject", () => {
		it("It should show groups of subject CN1", function (done){
			const req = {
				session: authenticatedUser,
				params: {abbreviation: "CN1"},
				flash: () => {},
			};
			const res = {
				render: (page, options) => {
					if (page === "grouplist" && options.groups) {
						done();
					}
				},
			};
			GroupsController.showGroupsOfSubject(req, res);
		});
	});

	describe("Show groupin detail", () => {
		it("It should show group with id 11", function (done){
			const req = {
				session: authenticatedUser,
				params: {id: {groupId: 11}},
				flash: () => {},
			};
			const res = {
				render: (page, options) => {
					if (page === "group" && options.group) {
						done();
					}
				},
				redirect: () => {
					done();
				},
			};
			GroupsController.showGroupInDetail(req, res);
		});
	});

	describe("Edit Group by Id", () => {
		it("It should edit group by id 11", function (done){
			const req = {
				session: authenticatedUser,
				params: {id: 11},
				flash: () => {},
			};
			const res = {
				render: (page, options) => {
					if (page === "editGroup" && options.group) {
						done();
					}
				},
			};
			GroupsController.editGroupById(req, res);
		});
	});

	describe("Update Group", () => {
		it("It should update group", function (done){
			const req = {
				session: authenticatedUser,
				params: {id: 11},
				body: {
					name: "Hansis Group",
					description: "Hansmuster mustert gerne",
					maxMemberCount: "5",
					applyByDate: "2022-07-12 18:23:20.280745+00",
					info: "das hier ist hansis gruppe",
				},
				flash: (status) => {
					if (status === "success"){
						done();
					}
				},
				get: () => {},
			};
			const res = {redirect: () => {
				done();
			}};
			GroupsController.updateGroup(req, res);
		});
	});

	describe("Apply to Group", () => {
		it("It should apply to group", function (done){
			const req = {
				session: authenticatedUser,
				params: {id: {groupId: 9}},
				body: {
					description: "please let me in",
				},
				flash: (status) => {
					if (status === "success"){
						done();
					}
				},
			};
			const res = {redirect: () => {
				done();
			}};
			GroupsController.applyToGroup(req, res);
		});
	});

	describe("Delete Group", () => {
		it("It should delete group", function (done){
			const req = {
				session: authenticatedUser,
				params: {id: 11},
				flash: (status) => {
					if (status === "success"){
						done();
					}
				},
			};
			const res = {redirect: () => {
				done();
			}};
			GroupsController.deleteGroup(req, res);
		});
	});

	describe("GET /groups/9", () => {
		it("It should get the group with the id '9'", async () => {
			authenticatedUser
				.get("/groups/9")
				.end((error, res) => {
					assert.equal(res.statusCode, 200);
					expect("Location", "/groups/9");
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


