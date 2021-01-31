const express = require('express')

const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')

//login and logout
//routes.get('/login', isLoggedRedirectToUser, SessionController.loginForm)
//routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)


//forgot and reset password

//user register
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

//routes.get('/', onlyUsers, UserValidator.show, UserController.show)
//routes.put('/', UserValidator.update, UserController.update)
//routes.delete('/', UserController.delete)



module.exports = routes