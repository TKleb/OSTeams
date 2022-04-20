import nodemailer from "nodemailer"
import mailerConfig from "../config/mailer.conifg.js";

class Mailer {
	constructor() {
		this.mail = nodemailer.createTransport( {
			service: mailerConfig.service,
			auth: {
				user: mailerConfig.email,
				pass: mailerConfig.password
			}
		});
	}

	SendMail(to, subject, html) {
		const mailOptions = {
			from: mailerConfig.email,
			to: to,
			subject: subject,
			html: html,
		};

		return this.mail.sendMail(mailOptions)
			.then((res) => {
				return "Email sent successfully";
			})
			.catch((err) => {
				return "There was an error sending your email: ".concat(err);
			});
	}
}

export default new Mailer();
