const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const profile = require('./profile')

//recipes routes
routes.use("/recipes", recipes)
//chefs routes
routes.use("/chefs", chefs)
//users routes
routes.use("/users", users)
//profile routes
routes.use("/profile", profile)



module.exports = routes