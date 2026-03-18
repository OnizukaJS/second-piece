import Router from 'koa-router'

import usersRouter from './usersRouter'

const apiRouter = new Router({prefix: '/api'})

apiRouter.use(usersRouter.routes(), usersRouter.allowedMethods())

export default apiRouter
