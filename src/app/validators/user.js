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

async function post(req, res, next) {
    //check fill all fields
    const fillAllFields = checkFields(req.body)
    if(fillAllFields) {
        return res.render ("amin/users/register", fillAllFields)
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

module.exports = {
    post,
}