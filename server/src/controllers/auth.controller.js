import crypto from 'crypto'
import { z } from 'zod'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { signToken } from '../middleware/auth.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendVerificationEmail } from '../utils/mailer.js'

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  course: z.string().trim().max(120).optional(),
  college: z.string().trim().max(120).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(100),
})

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  course: z.string().trim().max(120).optional(),
  college: z.string().trim().max(120).optional(),
})

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')

function assertCollegeEmail(email) {
  if (env.allowedEmailDomains.length === 0) return
  const domain = email.split('@')[1]
  // Accept the domain itself or any subdomain (e.g. cse.youruni.edu.in).
  const ok = env.allowedEmailDomains.some((d) => domain === d || domain.endsWith(`.${d}`))
  if (!ok) {
    throw new ApiError(400, `Please use your college email (${env.allowedEmailDomains.map((d) => '@' + d).join(', ')})`)
  }
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, course, college } = req.body
  assertCollegeEmail(email)
  if (await User.exists({ email })) throw new ApiError(409, 'An account with this email already exists')

  const user = new User({
    name,
    email,
    course,
    college,
    passwordHash: await User.hashPassword(password),
    isVerified: !env.requireEmailVerification,
  })

  if (env.requireEmailVerification) {
    const token = crypto.randomBytes(32).toString('hex')
    user.verificationTokenHash = sha256(token)
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()
    await sendVerificationEmail(email, name, `${env.serverUrl}/api/auth/verify-email/${token}`)
    return res.status(201).json({ message: 'Account created. Check your college inbox to verify your email.' })
  }

  await user.save()
  res.status(201).json({ token: signToken(user._id), user: user.toAccount() })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+passwordHash')
  // Same message for unknown email and wrong password.
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password')
  if (user.isBanned) throw new ApiError(403, 'This account has been suspended')
  if (env.requireEmailVerification && !user.isVerified) throw new ApiError(403, 'Please verify your email before logging in')
  res.json({ token: signToken(user._id), user: user.toAccount() })
})

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    verificationTokenHash: sha256(req.params.token),
    verificationExpires: { $gt: new Date() },
  }).select('+verificationTokenHash +verificationExpires')
  if (!user) throw new ApiError(400, 'Verification link is invalid or has expired')
  user.isVerified = true
  user.verificationTokenHash = undefined
  user.verificationExpires = undefined
  await user.save()
  res.redirect(`${env.clientUrl}/login?verified=1`)
})

export const me = (req, res) => res.json({ user: req.user.toAccount() })

export const updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body)
  await req.user.save()
  res.json({ user: req.user.toAccount() })
})
