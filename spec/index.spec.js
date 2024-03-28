const request = require('supertest');
const app=require('..')

const req=request(app)

describe('Test default route',()=>{
    it('expect when call get(/) to res has all todos',async()=>{
     let res= await req.get('/')
     console.log(res.body);
     expect(res.status).toBe(200)
     expect(res.body.todos).toHaveSize(0)
    })
})