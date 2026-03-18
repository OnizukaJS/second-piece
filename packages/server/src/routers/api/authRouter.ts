import Router from 'koa-router'

import {login, logout, register} from '../../controllers/authController'

const authRouter = new Router({prefix: '/auth'})

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

export default authRouter
