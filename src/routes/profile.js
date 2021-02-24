const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/user')
const ProfileController = require('../app/controllers/ProfileController')


//user profile
routes.get('/', UserValidator.show, ProfileController.index) //show user
// routes.put('/', ProfileController.put)


module.exports = routes