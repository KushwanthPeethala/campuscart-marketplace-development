import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transport
function getTransport() {
  if (!env.smtp.host) return null
  transport ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  })
  return transport
}

export async function sendVerificationEmail(to, name, link) {
  const t = getTransport()
  if (!t) {
    console.log(`[mail] SMTP not configured. Verification link for ${to}: ${link}`)
    return
  }
  await t.sendMail({
    from: env.smtp.from,
    to,
    subject: 'Verify your CampusCart account',
    text: `Hi ${name},\n\nConfirm your college email to start using CampusCart:\n${link}\n\nThis link expires in 24 hours.`,
  })
}
