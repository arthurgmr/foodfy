const { age, date} = require("../../lib/utils.js")

const Recipe = require("../models/Recipe")
const File = require("../models/File")
const { file } = require("../models/Chef.js")



module.exports = {

async index(req, res){
    try {
        let results = await Recipe.all()
        const recipes = results.rows

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            )
            return files[0]
        }

        const filesPromise = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id)
            return recipe
        })

        const allRecipe = await Promise.all(filesPromise)

        return res.render("admin/recipes/index", {recipes: allRecipe})
    } catch(err) {
        console.log(err)
    }
},

async create(req, res){
    
    let results = await Recipe.chefsSelectOptions()
    const chefsOption = results.rows

    return res.render("admin/recipes/create", {chefsOption})     

},

async post(req, res){
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            let results = await Recipe.chefsSelectOptions()
            const chefsOption = results.rows
            return res.render('admin/recipes/create', {
                chef: req.body,
                chefsOption,
                error: 'Please, fill all fields!'
            })
        }
    }

    if(req.files.length == 0)
        return res.send('Please, send at least one image!')
    
    try{  
        
      req.body.user_id = req.session.userId

      let results = await Recipe.create(req.body)
      const recipeId = results.rows[0].id

      const filesPromise = req.files.map(file => File.create({...file}))
      const filesResults = await Promise.all(filesPromise)
      
      const recipeFilePromise = filesResults.map( file => {
          const fileId = file.rows[0].id

          File.createRecipeFiles({recipeId, fileId})
      })

      await Promise.all(recipeFilePromise)
      
      return res.redirect(`/admin/recipes/${recipeId}`)

    }catch(err) {
      console.log(err)
    }

},

async show(req, res){
    try {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]            
            
        if(!recipe) return res.send("Ricipe not found!")

        results = await Recipe.files(req.params.id)
        const files = results.rows.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

    return res.render("admin/recipes/show", {recipe, files})

    }catch(err) {
        console.log(err)
    }
},

async edit(req, res){

    try {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
        if(!recipe) return res.send("Ricipe not found!")

        results = await Recipe.chefsSelectOptions()
        const chefsOption = results.rows            

        results = await File.findRecipeFiles(recipe.id)
        let files = results.rows            
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("admin/recipes/edit", {recipe, chefsOption, files})

    }catch(err) {
        console.log(err)
    }
},

async put(req, res){
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            let results = await Recipe.chefsSelectOptions()
            const chefsOption = results.rows
            return res.render('admin/recipes/create', {
                chef: req.body,
                chefsOption,
                error: 'Please, fill all fields!'
            })
        }
    }


    try{
        //save new files in table files and table recipe_files
        if(req.files.length != 0) {
            const recipeId = req.body.id
            const filesPromise = req.files.map(file => File.create({...file}))
            const filesResults = await Promise.all(filesPromise)

            const recipeFilePromise = filesResults.map( file => {
                const fileId = file.rows[0].id
      
                File.createRecipeFiles({recipeId, fileId})
            })
      
            await Promise.all(recipeFilePromise)
        }
        //remove old files
        if(req.body.removed_files) {
            // come to frontend: "1,2,3"
            const removedFiles = req.body.removed_files.split(",") //inset in array: [1,2,3,]
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1) //remove comma: [1,2,3]

            // remove file in table recipe_files and table files
            const removedFilesPromise = removedFiles.map(id => {
                File.deleteRecipeFiles(id)
                File.delete(id)
            })
            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)

    }catch(err) {
        console.log(err)
    }
},

async delete(req, res){

    try {
        const results = await Recipe.files(req.body.id)
        const deleteFilesPromisse = results.rows.map(file => {
            File.deleteRecipeFiles(file.id)
            File.delete(file.id)
        })
        await Promise.all(deleteFilesPromisse)
    
        await Recipe.delete(req.body.id)
        
        return res.redirect("/admin/recipes")

    }catch(err) {
        console.log(err)
    }
},
}
