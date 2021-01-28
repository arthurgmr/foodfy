const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {
    const { email, password } = req.body

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

    // all check ok, post user in req. user;
    req.user = user

    next()
}

module.exports = {
    login
}