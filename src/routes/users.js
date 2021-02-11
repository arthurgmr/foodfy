const express = require('express')

const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')

//logout
routes.post('/logout', SessionController.logout)

//users routes of is_admin user's
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/', UserController.index)
routes.get('/:id/edit', UserController.edit)
routes.put('/:id/edit', UserValidator.put, UserController.put)
routes.delete('/:id/edit', UserController.delete)

//routes.get('/', onlyUsers, UserValidator.show, UserController.show)
//routes.put('/', UserValidator.update, UserController.update)
//routes.delete('/', UserController.delete)



module.exports = routes