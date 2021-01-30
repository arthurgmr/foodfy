const express = require('express')
const routes = express.Router()

const PublicController = require('../app/controllers/PublicController')
const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/session')
const { onlyUsers, isLoggedRedirectToUser } = require('../app/middlewares/session')
const admin = require('./index-adm')



routes.get("/", PublicController.index)
routes.get("/about", PublicController.about)
routes.get("/search-recipe", PublicController.searchRecipe)
routes.get("/recipes", PublicController.recipes)
routes.get("/recipes/:id", PublicController.recipesShow)
routes.get("/chefs", PublicController.chefs)
routes.get("/chefs/:id", PublicController.chefsShow)

routes.get('/users/login', isLoggedRedirectToUser, SessionController.loginForm)
routes.post('/users/login', SessionValidator.login, SessionController.login)

routes.use("/admin", onlyUsers, admin)

//alias
routes.get('/accounts', function (req, res) {
    return res.redirect("admin/users/login")
})

module.exports = routes