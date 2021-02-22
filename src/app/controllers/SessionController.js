const User = require("../models/User")

const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { getFirstName } = require("../../lib/utils")
const { hash } = require("bcryptjs")


module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin

        return res.redirect("/admin/recipes")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render("admin/session/forgot-password")
    },
    async forgot (req, res) {
        const user = req.user

        try {
            //create token to user
            const token = crypto.randomBytes(20).toString("hex")

            //create expire token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            //send email with recover link to user
            user.name = getFirstName(user.name)
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recovery Foodfy Account',
                html:`
                <h3>Password Recovery</h3>
                <p> Hello ${user.name},
                    <br>
                    Do you lost your password? Don't worry, click on link to recovery your password!
                </p>
                <p>
                    <a href="http://localhost:3000/session/password-reset?token=${token}" target="_blank">
                        <strong>RECOVER PASSWORD</strong>
                    </a>
                    <br>
                </p>
                <p>See you later, bye!</p>
                `
            })

            //notify user
            return res.render('admin/session/login', {
                success: "Check your email, and follow the instructions!"
            })

        }catch(err) {
            console.log(err)
            return res.render("admin/session/forgot-password", {
                error: "Some error happened!"
            })
        }
    },
    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {

            //create hash password
            const newPassword = await hash(password, 8)

            //update user
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            //redirect to login and notify user about new password
            return res.render("admin/session/login", {
                user: req.body,
                success: "Password updated with success!"
            })

        }catch(err) {
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Some error happened!"
            })
        }
    }
}
