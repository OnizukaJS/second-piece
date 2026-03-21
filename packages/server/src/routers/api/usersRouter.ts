import Router from 'koa-router'

import {createUser, deleteUser, getCurrentUser, getUserById, getUsers, updateAvatar, updateUser, updateUserSettings} from '../../controllers/usersController'

const usersRouter = new Router({prefix: '/users'})

usersRouter.get('/me', getCurrentUser)
usersRouter.put('/me/avatar', updateAvatar)
usersRouter.put('/me/settings', updateUserSettings)
usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/', createUser)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
