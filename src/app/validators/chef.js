const Chef = require('../models/Chef')


//post chef
async function post(req, res, next) {
    //check fill all fields
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.render('admin/chefs/create', {
                isAdmin: req.session.isAdmin,
                chef: req.body,
                error: 'Please, fill all fields!'
            })
        }
    }

    //check req.files
    if(req.files.length == 0) {
        return res.render('admin/chefs/create', {
            isAdmin: req.session.isAdmin,
            chef: req.body,
            error: 'Please, send at least one image!'
        })
    }

    next()
    
}
//put recipe
async function put(req, res, next) {
    //check all fill fields
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            return res.render('admin/recipes/create', {
                isAdmin: req.session.isAdmin,
                chef: req.body,
                error: 'Please, fill all fields!'
            })
        }
    }

    next()
}

module.exports = {
    post,
    put,
}