import { Router } from 'express'
const router = Router();

import * as controller from '../controller/user.controller'

const { requireAuth } = require('../middleware/auth.middleware')

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/password/forgot', controller.forgotPassword)

router.post('/password/otp', controller.otp)

router.patch('/password/change', controller.change)

router.get('/detail', requireAuth, controller.detail)

router.get('/list', requireAuth, controller.list)



export const userRoutes: Router = router