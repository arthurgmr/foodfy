const express = require('express')
const routes = express.Router()

const PublicController = require('../app/controllers/PublicController')
const admin = require('./index-adm')
const session = require('./session')

const { onlyUsers } = require('../app/middlewares/session')

//public routes
routes.get("/", PublicController.index)
routes.get("/about", PublicController.about)
routes.get("/search-recipe", PublicController.searchRecipe)
routes.get("/recipes", PublicController.recipes)
routes.get("/recipes/:id", PublicController.recipesShow)
routes.get("/chefs", PublicController.chefs)
routes.get("/chefs/:id", PublicController.chefsShow)

//login, forgot and reset password routes
routes.use("/session", session)

//adm routes
routes.use("/admin", onlyUsers, admin)

//alias
routes.get('/accounts', function (req, res) {
    return res.redirect("admin/users/login")
})

module.exports = routes