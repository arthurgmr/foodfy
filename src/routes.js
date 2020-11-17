const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const guest = require("./app/controllers/guest")
const admin_recipe = require('./app/controllers/recipes')
const admin_chef = require('./app/controllers/chefs')


routes.get("/", guest.index)
routes.get("/about", guest.about)
routes.get("/search-recipe", guest.searchRecipe)
routes.get("/recipes", guest.recipes)
routes.get("/recipes/:id", guest.recipesShow)
routes.get("/chefs", guest.chefs)
routes.get("/chefs/:id", guest.chefsShow)


routes.get("/admin/recipes", admin_recipe.index)
routes.get("/admin/recipes/create", admin_recipe.create)
routes.get("/admin/recipes/:id", admin_recipe.show)
routes.get("/admin/recipes/:id/edit", admin_recipe.edit)
routes.post("/admin/recipes",multer.array("images", 5), admin_recipe.post)
routes.put("/admin/recipes/:id",multer.array("images", 5), admin_recipe.put)
routes.delete("/admin/recipes/:id", admin_recipe.delete)

routes.get("/admin/chefs", admin_chef.index)
routes.get("/admin/chefs/create", admin_chef.create)
routes.get("/admin/chefs/:id", admin_chef.show)
routes.get("/admin/chefs/:id/edit", admin_chef.edit)
routes.post("/admin/chefs",multer.array("avatar", 1), admin_chef.post)
routes.put("/admin/chefs/:id",multer.array("avatar", 1), admin_chef.put)
routes.delete("/admin/chefs/:id", admin_chef.delete)



module.exports = routes