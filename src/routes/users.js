const express = require('express')

const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')

//logout
routes.post('/logout', SessionController.logout)

//user register
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

//users
routes.get('/', UserController.index)
routes.get('/:id', UserController.show)

//routes.get('/', onlyUsers, UserValidator.show, UserController.show)
//routes.put('/', UserValidator.update, UserController.update)
//routes.delete('/', UserController.delete)



module.exports = routes