const User = require("../models/User")

const crypto = require(`crypto`)
const mailer = require('../../lib/mailer')




module.exports = {
    async show(req, res) {
        const { user } = req

        isAdmin = req.session.is_admin

        return res.render('admin/users/profile', { user, isAdmin })
    }
}