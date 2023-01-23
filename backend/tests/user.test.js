// MongoDB
import { config } from 'dotenv';    config();
import { connect, mongodbClose } from '../config/database.js'; connect();

// Http Server, Supertest
import server from '../api/server';
import request from 'supertest';

describe("User auth", ()=>{
    // Authentication
    describe("POST /Authentication ", ()=>{
        test("New User", async () =>{
            const response = await request(server)
            .post('/api/Authenticate')
            .send({
                username: "Omar",
                password: "0mar.Duadu!"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.headers['set-cookie'][0]).toMatch(/(refreshToken|Secure|HttpOnly|SameSite=None)/)
            expect(response.body.accessToken).toEqual(expect.any(String));
            expect(response.body.expiration).toEqual(expect.any(Number));
            expect(response.statusCode).toBe(200)
        })

        test("Invalid Username", async () =>{
            const response = await request(server)
            .post('/api/Authenticate')
            .send({
                username: "NotRegistered",
                password: "0mar.Duadu!"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.body.error).toEqual(expect.any(String));
            expect(response.statusCode).toBe(403)
        })

        test("Invalid Password", async () =>{
            const response = await request(server)
            .post('/api/Authenticate')
            .send({
                username: "Omar",
                password: "WrongPassword"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.body.error).toEqual(expect.any(String));
            expect(response.statusCode).toBe(401)
        })
    })

    // Registeration
    describe("POST /Registeration", ()=>{
        test("New user", async () =>{
            const response = await request(server)
            .post('/api/Register')
            .send({
                username: "NewUsertestTest",
                password: "0mar.Duadu!"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.headers['set-cookie'][0]).toMatch(/(refreshToken|Secure|HttpOnly|SameSite=None)/)
            expect(response.body.accessToken).toEqual(expect.any(String));
            expect(response.body.expiration).toEqual(expect.any(Number));
            expect(response.statusCode).toBe(200)
        })

        test("Invalid username", async () =>{
            const response = await request(server)
            .post('/api/Register')
            .send({
                username: "",
                password: "0mar.Duadu!"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.body.error).toEqual(expect.any(String));
            expect(response.body.emptyFields).toContain('username');
            expect(response.statusCode).toBe(400)
        })

        test("Invalid Password", async () =>{
            const response = await request(server)
            .post('/api/Register')
            .send({
                username: "OmarNewUser",
                password: "0mar"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.body.error).toEqual(expect.any(String));
            expect(response.body.emptyFields).toContain('password');
            expect(response.statusCode).toBe(400)
        })

        test("User already exists", async () =>{
            const response = await request(server)
            .post('/api/Register')
            .send({
                username: "Omar",
                password: "0mar.duad!.Com"
            })

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
            expect(response.body.error).toEqual(expect.any(String));
            expect(response.statusCode).toBe(409)
        })
    })
})

// Close server and DB
afterAll((done)=> {
    mongodbClose()
    server.close()
    done()
})

