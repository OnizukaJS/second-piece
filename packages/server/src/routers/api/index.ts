import Router from 'koa-router'

import {authenticate} from '../../middlewares/authenticate'

import authRouter from './authRouter'
import usersRouter from './usersRouter'

const apiRouter = new Router({prefix: '/api'})

// Public routes
apiRouter.use(authRouter.routes(), authRouter.allowedMethods())

// Protected routes
apiRouter.use(authenticate, usersRouter.routes(), usersRouter.allowedMethods())

export default apiRouter
