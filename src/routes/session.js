const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/session')
const { isLoggedRedirectToUser } = require('../app/middlewares/session')

//login
routes.get('/login', isLoggedRedirectToUser, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)

//forgot and reset password
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes