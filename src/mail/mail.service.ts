import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { errors } from 'src/utils/errors'
import { generateResetPassEmailContent } from 'src/utils/generate-reset-pass-mail-content'

@Injectable()
export class MailService {
	private transporter: nodemailer.Transporter
	EMAIL_USER = process.env.EMAIL_USER
	EMAIL_PASS = process.env.EMAIL_PASS
	NAME_COMPANY = process.env.NAME_COMPANY
	ORIGIN = process.env.ORIGIN

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.EMAIL_USER,
				pass: this.EMAIL_PASS,
			},
		})
	}

	async sendEmailResetPass(
		email: string,
		resetPassLink: string
	): Promise<void> {
		const goBackLink = `${this.ORIGIN}/password_reset`
		const companyName = this.NAME_COMPANY
		const options: Mail.Options = {
			from: this.EMAIL_USER,
			to: email,
			subject: `[${this.NAME_COMPANY}] Восстановление пароля`,
			...generateResetPassEmailContent({
				goBackLink,
				resetPassLink,
				companyName,
			}),
		}
		try {
			await new Promise((resolve, reject) => {
				this.transporter.sendMail(options, (err, response) => {
					if (err) {
						reject(err)
					} else {
						resolve(response)
					}
				})
			})
		} catch (err) {
			throw new InternalServerErrorException(errors.PasswordResetMessageNotSent)
		}
	}
}
