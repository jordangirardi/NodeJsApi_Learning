import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController{
    async create(request: Request,response: Response ){
        const {title, description} = request.body;
 
        const suvreysRepository = getCustomRepository(SurveysRepository);

        const user = suvreysRepository.create({
            title, description
        })

        await suvreysRepository.save(user);

        return response.status(201).json(user);
    }

    async show(request:Request, response:Response){
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }
}

export { SurveysController }; 
