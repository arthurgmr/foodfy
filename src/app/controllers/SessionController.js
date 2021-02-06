const User = require("../models/User")

const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { getFirstName } = require("../../lib/utils")


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
            return res.render('admin/session/forgot-password', {
                success: "Check your email, and follow the instructions!"
            })

        }catch(err) {
            console.log(err)
            return res.render("admin/session/forgot-password", {
                error: "Some error happened!"
            })
        }
    },
    resetForm (req, res) {
        return res.render("admin/session/reset-password")
    }
}
