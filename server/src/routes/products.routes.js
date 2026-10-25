import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { uploadImages } from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'
import * as c from '../controllers/products.controller.js'

const r = Router()
r.get('/', validate(c.listQuerySchema, 'query'), c.listProducts)
// Fixed paths must stay above /:id
r.get('/featured', c.featuredProducts)
r.get('/by-ids', c.productsByIds)
r.get('/mine', requireAuth, c.myProducts)
r.get('/:id', c.getProduct)
r.get('/:id/similar', c.similarProducts)
r.post('/', requireAuth, uploadImages, c.createProduct)
r.put('/:id', requireAuth, uploadImages, c.updateProduct)
r.patch('/:id/status', requireAuth, validate(c.statusSchema), c.setStatus)
r.delete('/:id', requireAuth, c.deleteProduct)
export default r
