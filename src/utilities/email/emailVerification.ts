import * as nodemailer from 'nodemailer';

import EmailMessagesDesign from './emailMessagesDesign'
import { PASS, USER } from '../../config/sendEmail.config'

export function emailVerification(_userData, code: number, isResetPassword: boolean = false) {


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: USER,
            pass: PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Articles System" <${USER}>`, // sender address
        to: _userData.email, // list of receivers
        subject: 'Articles System Verification Request', // Subject line
        text: 'Articles System', // plain text body
        html: EmailMessagesDesign(_userData.name, code, isResetPassword) // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error(`Verification email error`)
        }
    });
}