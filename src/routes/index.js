const express = require('express')
const routes = express.Router()

const PublicController = require('../app/controllers/PublicController')

const recipes = require('./recipes')
const chef = require('./chef')

routes.get("/", PublicController.index)
routes.get("/about", PublicController.about)
routes.get("/search-recipe", PublicController.searchRecipe)
routes.get("/recipes", PublicController.recipes)
routes.get("/recipes/:id", PublicController.recipesShow)
routes.get("/chefs", PublicController.chefs)
routes.get("/chefs/:id", PublicController.chefsShow)

routes.use("/admin/recipes", recipes)

routes.use("/admin/chefs", chef)

//alias
routes.get('/accounts', function (req, res) {
    return res.redirect("users/login")
})

module.exports = routes