const Recipe = require('../models/Recipe')

//post recipe
async function post(req, res, next) {
    //check fill all fields
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            let results = await Recipe.chefsSelectOptions()
            const chefsOption = results.rows
            return res.render('admin/recipes/create', {
                isAdmin: req.session.isAdmin,
                recipe: req.body,
                chefsOption,
                error: 'Please, fill all fields!'
            })
        }
    }

    //check req.files
    if(req.files.length == 0) {
        let results = await Recipe.chefsSelectOptions()
        const chefsOption = results.rows
        return res.render('admin/recipes/create', {
            isAdmin: req.session.isAdmin,
            recipe: req.body,
            chefsOption,
            error: 'Please, send at least one image!'
        })
    }

    next()
    
}
// edit recipe
async function edit(req, res, next) {
    //check req.session.userId is iqual recipe_id
    const result = await Recipe.find(req.params.id)
    const recipe = result.rows[0]
    if(req.session.userId != recipe.user_id && !req.session.isAdmin) {
        return res.redirect('/admin/recipes')
    }

    next()
}
//put recipe
async function put(req, res, next) {
    //check all fill fields
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            let results = await Recipe.chefsSelectOptions()
            const chefsOption = results.rows
            return res.render('admin/recipes/create', {
                isAdmin: req.session.isAdmin,
                recipe: req.body,
                chefsOption,
                error: 'Please, fill all fields!'
            })
        }
    }

    //check req.session.userId is iqual recipe_id
    const result = await Recipe.find(req.body.id)
    const recipe = result.rows[0]
    if(req.session.userId != recipe.user_id && !req.session.isAdmin) {
        return res.redirect('/admin/recipes')
    }

    next()
}
//delete recipe
async function del(req, res, next) {
    //check req.session.userId is iqual recipe_id
    const result = await Recipe.find(req.body.id)
    const recipe = result.rows[0]
    if(req.session.userId != recipe.user_id && !req.session.isAdmin) {
        return res.redirect('/admin/recipes')
    }

    next()
}

module.exports = {
    post,
    edit,
    put,
    del
}