const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/user')
const ProfileController = require('../app/controllers/ProfileController')


//user profile
routes.get('/', UserValidator.show, ProfileController.show) //show user profile
routes.put('/', UserValidator.update, ProfileController.update) //edit user profile


module.exports = routes