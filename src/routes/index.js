const express = require('express')
const routes = express.Router()

const PublicController = require('../app/controllers/PublicController')

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const profile = require('./profile')

routes.get("/", PublicController.index)
routes.get("/about", PublicController.about)
routes.get("/search-recipe", PublicController.searchRecipe)
routes.get("/recipes", PublicController.recipes)
routes.get("/recipes/:id", PublicController.recipesShow)
routes.get("/chefs", PublicController.chefs)
routes.get("/chefs/:id", PublicController.chefsShow)

routes.use("/admin/recipes", recipes)
routes.use("/admin/chefs", chefs)

routes.use("/admin/users", users)
routes.use("/admin/profile", profile)

//alias
routes.get('/accounts', function (req, res) {
    return res.redirect("admin/users/login")
})

module.exports = routes