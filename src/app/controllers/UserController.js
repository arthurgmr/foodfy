const User = require("../models/User")

const { getFirstName } = require("../../lib/utils")
const crypto = require(`crypto`)
const mailer = require('../../lib/mailer')



module.exports = {
    async index(req, res) {
        try {
            let results = await User.all()
            const users = results.rows

            return res.render("admin/users/index", { users })

        }catch(err) {
            return res.render("admin/users/index", {
                error: "Some error happaned!"
            })
        }
    },
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    async post(req, res) {
        let { name, email, is_admin } = req.body

        try {
            //create password to user
            const password = crypto.randomBytes(4).toString("hex");

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
            data.name = getFirstName(data.name)

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com',
                subject: 'Foodfy Account',
                html:`
                <h3>Password Foodfy</h3>
                <p> Hello ${data.name},
                    <br>
                    Here is the password to access your account, you can change it at any time!
                </p>
                <p>
                    Email: ${email}
                    <br>
                    Password: <strong>${password}</strong>
                    <br>
                </p>
                <p>See you later, bye!</p>
                `
            })

            return res.render('admin/users/register', {
                success: 'User registered with success!'
            })

        }catch(err) {
            console.log(err) 
            return res.render('admin/users/register', {
                user: req.body,
                error: 'Some error happened!'
            })
        }
    },
    async show(req, res) {
        try {
            let results = await User.findOne(req.params.id)
            const users = results.rows[0]

            if(!user) return res.render("admin/users/index", {
                error: "User not found!"
            })

            return res.render("admin/users/show", { users })

        }catch(err) {
            console.log(err)
            return res.render("admin/users/index", {
                error: "Some error happaned!"
            })
        }
    }

}