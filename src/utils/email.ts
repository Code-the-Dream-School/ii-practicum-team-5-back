import dotenv from 'dotenv'
dotenv.config()
// import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail'
import BadRequestError from '../errors/bad_request'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface EmailOptions {
  to: string
  subject: string
  message: string
  replyTo?: string
}

const sendEmail = async ({ to, subject, message, replyTo = 'noreply@gmail.com' }: EmailOptions) => {
  const msg = {
    to,
    from: `No Reply <${process.env.SENDER_EMAIL!}>`,
    subject,
    text: message,
    replyTo,
  }
  try {
    await sgMail.send(msg)
    console.log(`Email successfully sent to ${to}`)
  } catch (error) {
    console.error(error)
    throw new BadRequestError('Error sending email, Please try again later.')
  }
}

export default sendEmail
