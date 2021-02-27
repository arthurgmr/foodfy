const User = require("../models/User")

const { getFirstName } = require("../../lib/utils")
const crypto = require(`crypto`)
const mailer = require('../../lib/mailer')
const { hash } = require("bcryptjs")

module.exports = {
    async index(req, res) {
        try {
            let results = await User.all()
            const users = results.rows

            isAdmin = req.session.isAdmin

            return res.render("admin/users/index", { users, isAdmin })

        }catch(err) {
            console.log(err)
            return res.render("admin/users/index", {
                error: "Some error happaned!"
            })
        }
    },
    registerForm(req, res) {
        
        isAdmin = req.session.isAdmin

        return res.render("admin/users/register", { isAdmin })
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

            let results = await User.all()
            const users = results.rows
            
            isAdmin = req.session.isAdmin

            return res.render('admin/users/index', {
                users,
                isAdmin,
                success: 'User registered with success!'
            })

        }catch(err) {
            console.log(err) 

            isAdmin = req.session.isAdmin

            return res.render('admin/users/register', {
                isAdmin,
                user: req.body,
                error: 'Some error happened!'
            })
        }
    },
    async edit(req, res) {
        try {
            const id = req.params.id
            const user = await User.findOne({ where: {id} })

            isAdmin = req.session.isAdmin

            return res.render("admin/users/edit", { 
                user, 
                isAdmin,
                success: "User edited successfully!"
            })

        }catch(err) {
            console.log(err)

            let results = await User.all()
            const users = results.rows
            isAdmin = req.session.isAdmin

            return res.render("admin/users/index", {
                isAdmin,
                users,
                error: "Some error happaned!"
            })
        }
    },
    async put(req, res) {
        try {
            const { user } = req
            let { name, email, is_admin } = req.body

            //check if is change email
            //if emailEqual is false, send new password for user
            if(email != user.email) {
                //create password to user and create hash
                const password = crypto.randomBytes(4).toString("hex")
                const passwordHash = await hash(password, 8)
                //update passord
                await User.update(user.id, {password: passwordHash})
                //get first name of user
                 user.name = getFirstName(user.name)
                //send email with new password
                await mailer.sendMail({
                    to: email,
                    from: 'no-reply@foodfy.com',
                    subject: 'Foodfy Account',
                    html:`
                    <h3>Password Foodfy</h3>
                    <p> Hello ${user.name},
                        <br>
                        Your email has been changed and for security reasons we have generated a new password!
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
            }

            //bollean is_admin
            (!is_admin) ? is_admin = false : is_admin = true

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            let results = await User.all()
            const users = results.rows

            isAdmin = req.session.isAdmin

            return res.render("admin/users/index", {
                isAdmin,
                users,
                success: "User updated with success!"
            })

        }catch(err) {
            console.log(err)

            isAdmin = req.session.isAdmin

            return res.render("admin/users/edit", {
                isAdmin,
                user: req.body,
                error: "Some error happaned!"
            })
        }
    },
    async delete(req, res) {
        try {
            userId = req.session.userId
            const { id } = req.body

            const user = await User.findOne({ where: {id} })

            if(userId == id) return res.render("admin/users/edit", {
                isAdmin,
                user,
                error: "Sorry, but you can't delete your account!"
            })

            await User.delete(req.body.id)

            let results = await User.all()
            const users = results.rows
            
            return res.render("admin/users/index", {
                isAdmin,
                users,
                success: "Account Successfully Deleted"
            })

        }catch(err) {
            console.log(err)

            isAdmin = req.session.isAdmin

            return res.render("admin/users/edit", {
                isAdmin,
                user: req.body,
                error: "Some error happened!"
            })
        }
    }
}