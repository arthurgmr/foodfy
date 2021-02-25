const { compare } = require('bcryptjs')
const { getFirstName } = require('../../lib/utils')
const User = require('../models/User')

function checkAllFields(body, session) {
    //check if has all fields
    const keys = Object.keys(body)

    isAdmin = session.isAdmin
    firstNameUser = getFirstName(body.name)

    for(key of keys) {
        if (body[key] == "") {
            return {
                isAdmin,
                firstNameUser,
                user: body,
                error: 'Please, fill all fields!'
            }
        }           
    }
}

//user show
async function show(req, res, next) {
    const {userId: id, isAdmin} = req.session

    const user = await User.findOne({ where: {id} })

        if(!user) return res.redirect('/session/login')

        req.isAdmin = isAdmin
        req.user = user
    
    next()
}

//post user
async function post(req, res, next) {
    //check fill all fields
    const fillAllFields = checkAllFields(req.body, req.session)
    if(fillAllFields) {
        return res.render("admin/users/register", fillAllFields)
    }

    let { email } = req.body
    //check if user exists [email]
    const user = await User.findOne({
        where: {email}
    })
    if(user) return res.render("admin/users/register", {
        user: req.body,
        error: 'User exists!'
    })

    next()
    
}

//edit users
async function put(req, res, next) {
    //check all fill fields
    const fillAllFields = checkAllFields(req.body, req.session)
    if(fillAllFields) {
        return res.render("admin/users/register", fillAllFields)
    }

    //get id 
    const { id } = req.body

    //check if user exists [req.params.id]
    const user = await User.findOne({ where: {id} })

    if(!user) return res.render("admin/users", {
        error: "User not found!"
    })

    console.log('here')

    //post user in req.user
    req.isAdmin = isAdmin
    req.user = user

    next()
}

//update profile
async function update(req, res, next) {
    const { id, password } = req.body
    const user = await User.findOne({ where: {id} }) 
    
    //check all fill fields
    const fillAllFields = checkAllFields(req.body, req.session)
    if(fillAllFields) {
        return res.render("admin/users/profile", fillAllFields)
    }

    //check if password was type  
    if(!password) return res.render("admin/users/profile", {
        isAdmin,
        firstNameUser,
        user: req.body,
        error : "Type your password!"
    })

    //compare password
    const passed = await compare(password, user.password)

    if (!passed ) return res.render("admin/users/profile", {
        isAdmin,
        firstNameUser,
        user: req.body,
        error : "Incorrect password!"
    })

    req.isAdmin = isAdmin
    req.user = user

    next()

}

module.exports = {
    show,
    post,
    put,
    update,
}