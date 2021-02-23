const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')
const RecipeValidator = require('../app/validators/recipe')

routes.get("/", RecipesController.index)
routes.get("/create", RecipesController.create)
routes.get("/:id", RecipesController.show)
routes.get("/:id/edit",RecipeValidator.edit , RecipesController.edit)
routes.post("/",multer.array("images", 5), RecipeValidator.post, RecipesController.post)
routes.put("/:id",multer.array("images", 5),RecipeValidator.put, RecipesController.put)
routes.delete("/:id", RecipeValidator.del, RecipesController.delete)

module.exports = routes