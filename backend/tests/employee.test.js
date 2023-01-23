// MongoDB
import { config } from 'dotenv';    config();
import { connect, mongodbClose } from '../config/database.js'; connect();

// Http Server, Supertest
import server from '../api/server';
import request from 'supertest';

let accessToken;
let id;

// Employee Listing
describe("Employees CRUD", ()=>{
    test("Authenticated user", async ()=>{
        const response = await request(server)
        .post('/api/Authenticate')
        .send({
            username:"Omar",
            password:"0mar.Duadu!"
        })

        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body.accessToken).toEqual(expect.any(String))
        expect(response.statusCode).toBe(200)

        accessToken = response.body.accessToken; 
    })

    test("Unauthenticated user", async ()=>{
        const response = await request(server)
        .get('/api/Employees')

        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body.error).toEqual(expect.any(String))
        expect(response.statusCode).toBe(401)
    })

    describe("GET /Employees", ()=>{

        test("Valid request", async ()=>{
            const response = await request(server)
            .get('/api/Employees')
            .set('Authorization', `Bearer ${accessToken}`)
        
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.employees).toEqual(expect.any(Array))
            expect(response.statusCode).toBe(200)
        })
    
        test("Invalid request", async ()=>{
            const response = await request(server)
            .get('/api/Employees/12hhb')
            .set('Authorization', `Bearer ${accessToken}`)
        
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.error).toEqual(expect.any(String))
            expect(response.statusCode).toBe(405)
        })
    })
    
    describe("POST /Employees", ()=>{
    
        test("Add Valid Employee", async ()=>{
            const response = await request(server)
            .post('/api/Employees')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                firstName: "NewName",
                lastName: "ss",
                DOB: "1995-12-05",
                age: 25,
                email: "test1@gmail.com",
                active: true,
                skill: {
                    name: "sdd",
                    description: "Ammar"
                }
            })
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.id).toEqual(expect.any(String))
            expect(response.statusCode).toBe(201)
            id = response.body.id;
        })
    
        test("Missing/Invalid Field", async ()=>{
            const response = await request(server)
            .post('/api/Employees')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                lastName: "ss",
                DOB: "1995-12-05",
                age: 25,
                email: "test2@gmail.com",
                active: true,
                skill: {
                    name: "sdd",
                    description: "Ammar"
                }
            })
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.error).toEqual(expect.any(String))
            expect(response.body.emptyFields).toContain('firstName')
            expect(response.statusCode).toBe(400)
        })
        
        test("Email Already in use", async ()=>{
            const response = await request(server)
            .post('/api/Employees')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                lastName: "ss",
                firstName: "werhh",
                DOB: "1995-12-05",
                age: 25,
                email: "test1@gmail.com",
                active: true,
                skill: {
                    name: "sdd",
                    description: "Ammar"
                }
            })
           
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.error).toEqual(expect.any(String))
            expect(response.body.emptyFields).toContain('email')
            expect(response.statusCode).toBe(409)
        })
    })
    
    describe("PUT /Employees/id", ()=>{
    
        test("Update Valid Employee", async ()=>{
            const response = await request(server)
            .put(`/api/Employees/${id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                firstName: "Omar",
                lastName: "Omar",
                DOB: "1995-06-05",
                age: 24,
                email: "t@gmail.com",
                active: false,
                skill: {
                    name: "sdd",
                    description: "Ammar"
                }
            })
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.employee).toEqual(expect.any(Object))
            expect(response.statusCode).toBe(200)
        })
    
        test("Invalid Employee ID", async ()=>{
            const response = await request(server)
            .put('/api/Employees/87778899')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                firstName: "mmkkk",
                lastName: "ss",
                DOB: "1995-12-05",
                age: 25,
                email: "test5@gmail.com",
                active: true,
                skill: {
                    name: "sdd",
                    description: "Ammar"
                }
            })
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.error).toEqual(expect.any(String))
            expect(response.statusCode).toBe(400)
        })
    })
    
    describe("DELETE /Employees/id", ()=>{
    
        test("Delete Valid Employee", async ()=>{
            const response = await request(server)
            .delete(`/api/Employees/${id}`)
            .set('Authorization', `Bearer ${accessToken}`)
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.statusCode).toBe(200)
        })
    
        test("Invalid Employee ID", async ()=>{
            const response = await request(server)
            .delete('/api/Employees/87778899')
            .set('Authorization', `Bearer ${accessToken}`)
    
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(response.body.error).toEqual(expect.any(String))
            expect(response.statusCode).toBe(400)
        })
    })
})

// Close server and DB
afterAll((done)=> {
    mongodbClose()
    server.close()
    done()
})

