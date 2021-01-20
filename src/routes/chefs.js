const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController')

routes.get("/", ChefsController.index)
routes.get("/create", ChefsController.create)
routes.get("/:id", ChefsController.show)
routes.get("/:id/edit", ChefsController.edit)
routes.post("/", multer.array("avatar", 1), ChefsController.post)
routes.put("/:id", multer.array("avatar", 1), ChefsController.put)
routes.delete("/:id", ChefsController.delete)

module.exports = routes