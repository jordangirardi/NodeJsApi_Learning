import nodemailer, { Transporter } from 'nodemailer'
import {resolve} from 'path';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService{
    private client: Transporter
    
    constructor(){
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth:{
                    user: account.user,
                    pass: account.pass
                }
            });
            this.client = transporter;
        })
    }
    
    
    async execute(to: string, subject: string, variables:object, path:string){
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const htmlHandleBars = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject, 
            html: htmlHandleBars,
            from: "NPS <noreplay@nps.com.br>"
        });

        console.log("Message sent: %s",message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();