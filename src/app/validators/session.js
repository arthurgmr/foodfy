const { compare } = require('bcryptjs')
const User = require('../models/User')

function checkAllFields(body) {
    //check if has all fields
    const keys = Object.keys(body)

    for(key of keys) {
        if(body[key] == "") {
            return {
                user: body,
                error: 'Please, fill all fields!'
            }
        }
    }
}

async function login(req, res, next) {
    const { email, password } = req.body

    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("/admin/session/index", fillAllFields)
    }

    //check register user;
    const user = await User.findOne({ where: {email} })

    if(!user) return res.render("admin/session/index", {
        user: req.body,
        error: "User has no registration!"
    })

    //check password matching;
    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/session/index", {
        user: req.body,
        error: "Incorret password!"
    })

    // all check ok, post user in req.user;
    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    //check fill all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/session/forgot-password", fillAllFields)
    }

    //check register user

    //all check ok, post user in req.user;
    req.user = user

    next()

}

module.exports = {
    login,
    forgot
}