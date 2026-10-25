import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { env } from './config/env.js'
import { UPLOAD_DIR } from './middleware/upload.js'
import { errorHandler, notFound } from './middleware/error.js'
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/categories.routes.js'
import productRoutes from './routes/products.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'

export const app = express()

if (env.isProd) app.set('trust proxy', 1) // correct client IPs behind Render/Railway proxies
// Uploaded images are loaded by the frontend from another origin, so allow cross-origin embedding.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: env.clientUrl.split(',').map((s) => s.trim()), credentials: true }))
app.use(morgan(env.isProd ? 'combined' : 'dev'))
app.use(express.json({ limit: '100kb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false }))

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }),
)
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/wishlist', wishlistRoutes)

app.use(notFound)
app.use(errorHandler)
