import request from 'supertest';
import { app } from '../app';  

import createConnection from "../database";


describe("Users", () => {

    beforeAll( async ()=> {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("SHould be able to create a new User", async () => {
        const reponse = await request(app).post("/users")
        .send ({ 
        email:"user@example.com",
        name:"User Example"
        });

    expect(reponse.status).toBe(201);
    });

    it("Should not be able to create an user with exists email", async () => {
        const reponse = await request(app).post("/users")
        .send ({ 
        email:"user@example.com",
        name:"User Example"
        });

    expect(reponse.status).toBe(400);
    });
});

