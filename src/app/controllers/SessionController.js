const User = require("../models/User")

const crypto = require('crypto')
const mailer = require('../../lib/mailer')


module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/index")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("/admin/recipes")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm (req, res) {
        return res.render("admin/session/forgot-password")
    },
    forgot (req, res) {
        return
    }
}
