const User = require("../models/User")

const crypto = require(`crypto`)
const mailer = require('../../lib/mailer')


module.exports = {
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    async post(req, res) {
        let { name, email, is_admin } = req.body

        try {
            //create password to user
            const password = crypto.randomBytes(8).toString("hex")

            //bollean is_admin
            (!is_admin) ? is_admin = false : is_admin = true

            //post user
            const data = {
                name,
                email,
                password,
                is_admin
            }

            const userId = await User.create(data)

            //send email with password
            name = name.replace(/(')/g, "$1'").split(' ').slice(0, -2).join(' ');

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com',
                subject: 'Foodfy Account',
                html:`
                <h5>Password Foodfy</h5>
                <p> Hello ${name}
                    <br>
                    Here is the password to access your account, you can change it at any time!
                </p>
                <p>
                    Email: ${email}
                    <br>
                    Password: <strong>${password}</strong>
                    <br>
                </p>
                `
            })

            return res.redirect('/admin/users/register', {
                success: 'User registered with success!'
            })

        }catch(err) {
            console.log(err) 
            return res.render('/admin/users/register', {
                user: req.body,
                error: 'Some error happened!'
            })
        }
    }
}