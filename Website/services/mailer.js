import nodemailer from "nodemailer";
import mailerConfig from "../config/mailer.conifg.js";

class Mailer {
	constructor() {
		this.mail = nodemailer.createTransport({
			service: mailerConfig.service,
			auth: {
				user: mailerConfig.email,
				pass: mailerConfig.password,
			},
		});
	}

	SendMail(to, subject, html) {
		const mailOptions = {
			from: mailerConfig.email,
			to,
			subject,
			html,
		};

		return this.mail.sendMail(mailOptions);
	}
}

export default new Mailer();
