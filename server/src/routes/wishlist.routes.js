import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import * as c from '../controllers/wishlist.controller.js'

const r = Router()
r.use(requireAuth)
r.get('/', c.getWishlist)
r.post('/:id', c.addToWishlist)
r.delete('/:id', c.removeFromWishlist)
export default r
