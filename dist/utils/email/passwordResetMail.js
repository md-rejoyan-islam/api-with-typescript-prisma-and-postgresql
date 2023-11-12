"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nodemailer = require("nodemailer");
const { clientURL, emailPass, emailUser, smtpHost, smtpPort, } = require("../../secret.js");
const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
        user: emailUser,
        pass: emailPass, // email password
    },
});
const sendPasswordResetMail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = emailData;
        const mailInfo = {
            from: `Password Reset <${emailUser}>`,
            to: emailData.email,
            subject: emailData.subject,
            html: `
     <body><main style="min-height:100vh;padding:25px 6px;background-color:#f7f8fe;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif"><div style="margin:auto;width:fit-content"><div style="max-width:500px"><figure style="margin:auto;text-align:center"><img src="https://github.com/KINSUST/image/blob/main/kin-logo.png?raw=true" alt="" style="width:140px"></figure></div><div class="main-container" style="max-width:500px;background-color:#fff;border:1px solid #bab9b9;padding:15px;border-radius:5px"><div class="mail-header"></div><div class="mail-body" style="font-size:18px"><p style="text-align:center;margin:0;padding-bottom:8px;font-size:20xp;font-weight:600">KIN Password Reset Code</p><p style="margin:0;padding:4px;text-align:justify;font-size:15px">We received a request to reset your account password.To verify your email address, please use the following verification code:</p><p style="text-align:center"><span style="margin:0;font-size:25px;font-weight:900;letter-spacing:6px">${code}</span></p><p style="margin:0;padding:4px;font-size:15px">Thanks,<br><span style="font-family:Arial #000;color:red">KIN</span> A Voluntary Organization,<span style="font-weight:700">SUST</span></p></div></div></div></main></body>

     `,
        };
        const info = yield transport.sendMail(mailInfo);
        console.log("Message sent: %s", info.envelope.to[0]);
    }
    catch (error) {
        console.log("Message sent failed!");
    }
});
module.exports = sendPasswordResetMail;
