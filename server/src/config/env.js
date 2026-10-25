import 'dotenv/config'

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key} (see .env.example)`)
    process.exit(1)
  }
}

const port = Number(process.env.PORT) || 5000

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  serverUrl: (process.env.SERVER_URL || `http://localhost:${port}`).replace(/\/$/, ''),
  allowedEmailDomains: (process.env.ALLOWED_EMAIL_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean),
  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'CampusCart <no-reply@campuscart.local>',
  },
}

if (env.isProd && env.allowedEmailDomains.length === 0) {
  console.warn('WARNING: ALLOWED_EMAIL_DOMAINS is empty, so any email can register.')
}
