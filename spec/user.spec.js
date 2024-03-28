const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

const req = request(app);

describe("Test User Routes", () => {
  afterAll(async () => {
    await clearDatabase();
  });
  beforeAll(() => {
    process.env.SECRET = "this-is-my-jwt-secret";
  });
  let mockUser = { name: "amira", email: "asd@gmail.com", password: "123" };
  let userInDb;
  it("expect get(/) to res with all users", async () => {
    let res = await req.get("/user/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it("expect post(/signup) and valid user then get res correctly", async () => {
    let res = await req.post("/user/signup").send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe(mockUser.name);
    // console.log(res.body.data);
    userInDb=res.body.data;
  });
  it("expect get(/) to res with all users", async () => {
    let res = await req.get("/user/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(1);
  });
  it("expect post(/login) with valid user to login successfuly", async () => {
    let res = await req.post("/user/login").send(mockUser);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it("expect post(/login) with invalid user to send Invalid email or password'", async () => {
    let res = await req.post("/user/login").send({name:'ramy',email:'ramy@gmail.com',password:'asd'});
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid')
  });

  it('expect get(/user/:id) to get spacific user',async()=>{
      console.log(userInDb);
      let res=await req.get('/user/'+userInDb._id);
      expect(res.status).toBe(200)
      expect(res.body.data.password).toBe(userInDb.password)
  })
});
