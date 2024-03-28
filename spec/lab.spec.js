const request = require("supertest");
const app = require("..");

const req = request(app);
const { clearDatabase } = require("../db.connection");

describe("lab testing:", () => {
  let mockUser = { name: "mostafa", email: "asd@gmail.com", password: "123" };
  let token;
  let todoinDb;

  beforeAll(async () => {
    process.env.SECRET = "this-is-my-jwt-secret";
    let mockUser = {
      name: "mostafa",
      email: "asd@gmail.com",
      password: "123",
    };
    let res1 = await req.post("/user/signup").send(mockUser);
    userInDb = res1.body.data;
    let res2 = await req.post("/user/login").send(mockUser);
    token = res2.body.token;
    let res3 = await req
      .post("/todo/")
      .send({ title: "alaa", status: "In progress", userId: userInDb._id })
      .set({ authorization: token });
    todoinDb = res3.body.data;
  });

  describe("users routes:", () => {
    // Note: user name must be sent in req query not req params
    it("req to get(/search) ,expect to get the correct user with his name", async () => {
      let res = await req.get("/user/search?" + mockUser.name);

      expect(res.status).toBe(200);
    });
    it("req to get(/search) with invalid name ,expect res status and res message to be as expected", async () => {
      let res = await req.get("/user/search?ala");

      expect(res.body.message).toContain("There is no user with name: ");
    });

    it("req to delete(/) ,expect res status to be 200 and a message sent in res", async () => {
      let res = await req.delete("/user/");
      expect(res.status).toBe(200);
      expect(res.body.message);
    });
  });

  describe("todos routes:", () => {
    it("req to patch(/) with id only ,expect res status and res message to be as expected", async () => {
      let res = await req
        .patch("/todo/ " + todoinDb._id)

        .set({ authorization: token });

      expect(res.status).toBe(400);
    });
    it("req to patch(/) with id and title ,expect res status and res to be as expected", async () => {
      let res = await req
        .patch(`/todo/${todoinDb._id}`)
        .send({ title: "do unit tesin" })
        .set({ authorization: token });

      expect(res.status).toBe(200);
    });

    it("req to get( /user) ,expect to get all user's todos", async () => {
      let res = await req.get("/todo/").set({ authorization: token });

      expect(res.body.length).toBe > 0;
    });
    it("req to get( /user) ,expect to not get any todos for user hasn't any todo", async () => {
      let res = await req
        .get("/todo/")
        .set({ authorization: "+115asdasdwqeqwewqe" });

      expect(res.body.length).toBe === 0;
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
