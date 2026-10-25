import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const signToken = (userId) =>
  jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

async function loadUser(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  let payload
  try {
    payload = jwt.verify(header.slice(7), env.jwtSecret)
  } catch {
    throw new ApiError(401, 'Invalid or expired token')
  }
  const user = await User.findById(payload.sub)
  if (!user) throw new ApiError(401, 'Account no longer exists')
  if (user.isBanned) throw new ApiError(403, 'This account has been suspended')
  return user
}

/** Requires a valid Bearer token. Sets req.user. */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const user = await loadUser(req)
  if (!user) throw new ApiError(401, 'Authentication required')
  req.user = user
  next()
})

/** Sets req.user when a valid token is sent, but never blocks the request. */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  try {
    req.user = (await loadUser(req)) || undefined
  } catch {
    req.user = undefined
  }
  next()
})

export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'Not allowed'))
