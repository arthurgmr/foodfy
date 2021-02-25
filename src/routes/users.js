const express = require('express')

const routes = express.Router()

const { isAdmin } = require('../app/middlewares/session')

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')

//logout
routes.post('/logout', SessionController.logout)

//users routes of is_admin user's
routes.get('/register', isAdmin, UserController.registerForm)
routes.post('/register', isAdmin, UserValidator.post, UserController.post)

routes.get('/', isAdmin,  UserController.index)
routes.get('/:id/edit', isAdmin, UserController.edit)
routes.put('/:id/edit', isAdmin, UserValidator.put, UserController.put)
routes.delete('/:id/edit', isAdmin, UserController.delete)

//routes.get('/', onlyUsers, UserValidator.show, UserController.show)
//routes.put('/', UserValidator.update, UserController.update)
//routes.delete('/', UserController.delete)



module.exports = routes