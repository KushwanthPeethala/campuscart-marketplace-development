import multer from 'multer'
import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'
import { removeUploadedUrls } from './upload.js'

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))

// eslint-disable-next-line no-unused-vars
export async function errorHandler(err, req, res, _next) {
  // Clean up files multer already saved if the request then failed.
  if (req.files?.length) await removeUploadedUrls(req.files.map((f) => `${env.serverUrl}/uploads/${f.filename}`))

  let status = err.status || 500
  let message = err.message || 'Something went wrong'
  let details = err.details

  if (err instanceof ZodError) {
    status = 400
    message = 'Validation failed'
    details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
  } else if (err instanceof multer.MulterError) {
    status = 400
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5 MB or smaller' : err.message
  } else if (err.name === 'CastError') {
    status = 400
    message = `Invalid ${err.path}`
  } else if (err.code === 11000) {
    status = 409
    message = 'That value is already in use'
  } else if (err.type === 'entity.parse.failed') {
    status = 400
    message = 'Malformed JSON body'
  }

  if (status >= 500) console.error(err)
  res.status(status).json({
    error: status >= 500 && env.isProd ? 'Internal server error' : message,
    ...(details ? { details } : {}),
  })
}
