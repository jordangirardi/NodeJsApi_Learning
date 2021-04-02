import { resolve } from 'path';
import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController{
    async execute(request:Request, response:Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        if(!user){
            return response.status(400).json({
                error: "User does not exists!"
            });
        }
        
        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs");
        const survey = await surveyRepository.findOne({id: survey_id});

        if(!survey){
            return response.status(400).json({
                error:"Surveys does not exists!"
            })
        }

        const variables = {
            name: user.name,
            title: survey.title, 
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveysUserAlreadyExists = await surveysUserRepository.findOne({
            where:[{user_id : user.id},{value : null}],
            relations: ["user","survey"],
        });

        if(surveysUserAlreadyExists){
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveysUserAlreadyExists);
        }

        //save info in table surveyTable
        const surveyUser = surveysUserRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUserRepository.save(surveyUser);

        //send mail to user 
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);

    }
}

export{SendMailController}