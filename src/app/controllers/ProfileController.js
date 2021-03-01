const User = require("../models/User")

const { getFirstName } = require("../../lib/utils")


module.exports = {
    show(req, res) {
        const { user, isAdmin } = req

        firstNameUser = getFirstName(user.name)

        return res.render('admin/users/profile', { user, firstNameUser, isAdmin })
    },
    async update(req, res) {
        const { isAdmin, user } = req
        firstNameUser = getFirstName(user.name)

        try {
            const { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render("admin/users/profile", {
                isAdmin,
                firstNameUser,
                user: req.body,
                success : "User updated with success!"
            })

        }catch(err) {
            console.log(err)
            return res.render("admin/users/profile", {
                isAdmin,
                firstNameUser,
                user: req.body,
                error : "Some error happened!"
            })
        }
    }
}