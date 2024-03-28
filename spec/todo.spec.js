const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

const req = request(app);

fdescribe("Test Todo Routes", () => {
  let userInDb;
  let token;
  let todoinDb
  afterAll(async () => {
    await clearDatabase();
  });
  beforeAll(async () => {
    process.env.SECRET = "this-is-my-jwt-secret";
    let mockUser = { name: "amira", email: "asd@gmail.com", password: "123" };
    let res1 = await req.post("/user/signup").send(mockUser);
    userInDb = res1.body.data;
    let res2 = await req.post("/user/login").send(mockUser);
    token = res2.body.token;
  });
  it("expect get(/) to res with all todos", async () => {
    let res = await req.get("/todo/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it('expect post(/todo/) to add a todo successfully', async()=>{
     let res=await req.post('/todo/').send({title:'do Tasks'}).set({authorization:token})
     expect(res.status).toBe(201)
     todoinDb=res.body.data
  })
  it("expect get(/todo/:id) to get todo correctly",async()=>{
     let res=await req.get('/todo/'+todoinDb._id).set({authorization:token});
     expect(res.body.data.title).toContain('Tasks')
  })
  it("expect get(/todo/:id) to return message  please login first if notauthorized  ",async()=>{
     let res=await req.get('/todo/'+todoinDb._id)
     expect(res.body.message).toContain('please login first')
  })

  it("expect get(/todo/) to delete all todos correctly",async()=>{
    let res=await req.delete('/todo/').set({authorization:token});
    expect(res.body.message).toContain('todos have been deleted successfully')
 })

});
