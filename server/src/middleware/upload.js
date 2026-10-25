import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

export const UPLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

export const MAX_IMAGES = 5
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Never trust the client's filename: generate our own and pick the extension from the MIME type.
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXT[file.mimetype]}`),
})

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: MAX_IMAGES },
  fileFilter: (_req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new ApiError(400, 'Only JPG, PNG or WebP images are allowed')),
}).array('images', MAX_IMAGES)

export const fileUrl = (filename) => `${env.serverUrl}/uploads/${filename}`

/** Delete files from disk for any of these URLs that point at our uploads folder. */
export async function removeUploadedUrls(urls = []) {
  const prefix = `${env.serverUrl}/uploads/`
  await Promise.all(
    urls
      .filter((u) => typeof u === 'string' && u.startsWith(prefix))
      .map((u) => fs.promises.unlink(path.join(UPLOAD_DIR, path.basename(u))).catch(() => {})),
  )
}
