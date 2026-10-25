import { Router } from 'express'
import * as c from '../controllers/categories.controller.js'

const r = Router()
r.get('/', c.listCategories)
r.get('/counts', c.categoryCounts) // must stay above /:slug
r.get('/:slug', c.getCategory)
export default r
