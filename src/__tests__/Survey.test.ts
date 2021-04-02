import { response } from 'express';
import request from 'supertest';
import { app } from '../app';  

import createConnection from "../database";


describe("Surveys", () => {

    beforeAll( async ()=> {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("SHould be able to create a new Survey", async () => {
        const response = await request(app).post("/surveys")
        .send ({ 
        title:"example",
        description:"Example"
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys" , async () =>{
        await request(app).post("/surveys").send ({ 
        title:"example2",
        description:"Example2"
        });

        const response = await request(app).get("/show");

        expect(response.body.length).toBe(2);
    })

});

