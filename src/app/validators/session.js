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

    //check fill all fields;
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/session/forgot-password", fillAllFields)
    }

    //check register user;
    const user = await User.findOne({ where: {email} })

    if(!user) return res.render("admin/session/forgot-password", {
        user: req.body,
        error: "User has no registration!"
    })

    //all check ok, post user in req.user;
    req.user = user

    next()

}

async function reset(req, res, next) {

    const {email, password, passwordRepeat, token} = req.body

    try {
        //check register user;
        const user = await User.findOne({ where: {email} })

        if(!user) return res.render("admin/session/password-reset", {
            user: req.body,
            token,
            error: "User has no registration!"
        })

        //check match password; PAREI AQUI
        if(password != passwordRepeat) return res.render("admin/session/password-reset", {
            user: req.body,
            token,
            error: "Password mismatch!"
        })

        //check match token;
        if(token != user.reset_token) return res.render("admin/session/password-reset", {
            user: req.body,
            token,
            error: "Token mismatch!"
        })

        //check if token has expired;
        let now = new Date()
        now = now.setHours(now.getHours())

        if(now > user.reset_token_expires) return res.render("admin/session/password-reset", {
            user: req.body,
            token,
            error: "Token expired!"
        })

        //all check ok, post user in req.user;
        req.user = user

        next()

    }catch(err) {
        console.log(err)
        return res.render ("admin/session/password-reset", {
            user: req.body,
            token,
            error: "Some error happened!"
        })
    }
}

module.exports = {
    login,
    forgot,
    reset
}