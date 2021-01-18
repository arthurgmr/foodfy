const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')

routes.get("/", RecipesController.index)
routes.get("/create", RecipesController.create)
routes.get("/:id", RecipesController.show)
routes.get("/:id/edit", RecipesController.edit)
routes.post("/",multer.array("images", 5), RecipesController.post)
routes.put("/:id",multer.array("images", 5), RecipesController.put)
routes.delete("/:id", RecipesController.delete)

module.exports = routes