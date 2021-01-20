const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')

//login and logout

//forgot and reset password

//user register
routes.get('/register', UserController.registerForm)
//routes.get('/register', UserValidator, UserController.post)

//routes.get('/', onlyUsers, UserValidator.show, UserController.show)
//routes.put('/', UserValidator.update, UserController.update)
//routes.delete('/', UserController.delete)



module.exports = routes