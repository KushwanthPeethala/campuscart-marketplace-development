import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import * as c from '../controllers/auth.controller.js'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again in a few minutes' },
})

const r = Router()
r.post('/register', authLimiter, validate(c.registerSchema), c.register)
r.post('/login', authLimiter, validate(c.loginSchema), c.login)
r.get('/verify-email/:token', c.verifyEmail)
r.get('/me', requireAuth, c.me)
r.patch('/me', requireAuth, validate(c.updateMeSchema), c.updateMe)
export default r
