const User = require('../models/User')

function checkAllFields(body) {
    //check if has all fields
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Please, fill all fields!'
            }
        }           
    }
}

//post user
async function post(req, res, next) {
    //check fill all fields
    const fillAllFields = checkAllFields(req.body)
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
    const fillAllFields = checkAllFields(req.body)
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

    //post user in req.user
    req.user = user

    next()
}

module.exports = {
    post,
    put,
}