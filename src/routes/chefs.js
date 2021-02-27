const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { isAdmin } = require('../app/middlewares/session')

const ChefsController = require('../app/controllers/ChefsController')
const ChefValidator = require('../app/validators/chef')

routes.get("/", ChefsController.index)
routes.get("/create", isAdmin, ChefsController.create)
routes.get("/:id", ChefsController.show)
routes.get("/:id/edit", isAdmin, ChefsController.edit)
routes.post("/", multer.array("avatar", 1), isAdmin, ChefValidator.post, ChefsController.post)
routes.put("/:id", multer.array("avatar", 1), isAdmin, ChefValidator.put, ChefsController.put)
routes.delete("/:id", isAdmin, ChefsController.delete)

module.exports = routes