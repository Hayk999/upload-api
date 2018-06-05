import { Router } from 'express'

import passport from 'modules/passport'
import adminRoutes from './admin'
import * as middleware from 'middleware'
import * as adminController from 'controllers/adminController'

const router = new Router()

// get admin routes
router.post('/login', adminController.login)

router.use('/admin', [passport.authenticate('jwt', { session: false }), middleware.admin], adminRoutes)

export default router
