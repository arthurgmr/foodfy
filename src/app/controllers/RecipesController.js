const Recipe = require("../models/Recipe")
const File = require("../models/File")

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

        const allRecipes = await Promise.all(filesPromise)

        isAdmin = req.session.isAdmin

        return res.render("admin/recipes/index", {recipes: allRecipes, isAdmin})
        
    } catch(err) {
        console.log(err)
        return res.render("admin/recipes/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
        })
    }
},

async create(req, res){
    try {
        let results = await Recipe.chefsSelectOptions()
        const chefsOption = results.rows
    
        isAdmin = req.session.isAdmin
    
        return res.render("admin/recipes/create", {chefsOption, isAdmin})    

    }catch(err) {
        console.log(err)
        return res.render("admin/chefs/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
        })
    } 

},

async post(req, res){
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

      let results = await Recipe.chefsSelectOptions()
      const chefsOption = results.rows
  
      isAdmin = req.session.isAdmin
  
      return res.render("admin/recipes/create", {
          chefsOption, 
          isAdmin,
          success: "Recipe successfully created!"
        })   

    }catch(err) {
      console.log(err)
      return res.render("admin/chefs/index", {
        isAdmin: req.session.isAdmin,
        error: "Sorry, something went wrong. Contact your administrator."
        })
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

        isAdmin = req.session.isAdmin
        userSession = req.session.userId

    return res.render("admin/recipes/show", {recipe, files, isAdmin, userSession})

    }catch(err) {
        console.log(err)
        return res.render("admin/chefs/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
            })
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

        isAdmin = req.session.isAdmin

        return res.render("admin/recipes/edit", {
            recipe, 
            chefsOption, 
            iles, 
            sAdmin,
            success: "Recipe successfully edited!"
        })

    }catch(err) {
        console.log(err)
        return res.render("admin/chefs/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
            })
    }
},

async put(req, res){

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
        return res.render("admin/chefs/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
            })
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

        const allRecipes = await Promise.all(filesPromise)

        isAdmin = req.session.isAdmin

        return res.render("admin/recipes/index", {
            recipes: allRecipes, 
            isAdmin,
            success: "Recipe successfully deleted!"
        })

    }catch(err) {
        console.log(err)
        return res.render("admin/chefs/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
            })
    }
},
}
