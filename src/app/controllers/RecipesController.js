const { unlinkSync } = require("fs")

const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const File = require("../models/File")
const RecipeFiles = require("../models/RecipeFiles")

module.exports = {

async index(req, res){
    try {
        const recipes = await Recipe.all()

        async function getImage(recipeId) {
            let recipeFiles = await RecipeFiles.findFiles(recipeId)
            const files = recipeFiles.map(file =>
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
        })
        
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
        const chefsOption = await Chef.findAll()
    
        isAdmin = req.session.isAdmin
    
        return res.render("admin/recipes/create", {chefsOption, isAdmin})    

    }catch(err) {
        console.log(err)
        return res.render("admin/recipes/index", {
            isAdmin: req.session.isAdmin,
            error: "Sorry, something went wrong. Contact your administrator."
        })
    } 

},

async post(req, res){
   try{  
        
      let {
        title,
        chef_id,
        featured,
        homepage,
        ingredients,
        preparation,
        information
      } = req.body

      recipeId = await Recipe.create({
        title,
        chef_id,
        user_id: req.session.userId,
        featured,
        homepage,
        ingredients,
        preparation,
        information
      })

      let filesPromise = req.files.map(file => File.create({name: file.filename, path: file.path}))
      let filesResults = await Promise.all(filesPromise)
      
      const recipeFilePromise = filesResults.map(async file => {
        //   const fileId = file.rows[0].id
          await RecipeFiles.create({recipe_id: recipeId, file_id: file})
      })

      await Promise.all(recipeFilePromise)

      //redirect to index recipes
      const recipes = await Recipe.all()

        async function getImage(recipeId) {
            let recipeFiles = await RecipeFiles.findFiles(recipeId)
            const files = recipeFiles.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            )
            return files[0]
        }

        filesPromise = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id)
            return recipe
        })

        const allRecipes = await Promise.all(filesPromise)

        isAdmin = req.session.isAdmin

        return res.render("admin/recipes/index", {
            recipes: allRecipes, 
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
        const recipe = await Recipe.findRecipe(req.params.id)

        if(!recipe) return res.send("Ricipe not found!")

        let files = await RecipeFiles.findFiles(req.params.id)            
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
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
        const { recipe } = req

        if(!recipe) return res.send("Ricipe not found!")

        const chefsOption = await Chef.findAll()

        let files = await RecipeFiles.findFiles(recipe.id)            
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        isAdmin = req.session.isAdmin

        return res.render("admin/recipes/edit", {
            recipe, 
            chefsOption, 
            files, 
            isAdmin
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
            let filesPromise = req.files.map(file => File.create({name: file.filename, path: file.path}))
            let filesResults = await Promise.all(filesPromise)

            const recipeFilePromise = filesResults.map(async file => {
                  await RecipeFiles.create({recipe_id: recipeId, file_id: file})
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
            const removedFilesPromise = removedFiles.map(async id => {
                RecipeFiles.delete(id)

                const file = await File.find(id)
                
                //HERE
                unlinkSync(file.path)

                File.delete(id)
            })
            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body.id, {
            title: req.body.title,
            chef_id: req.body.chef_id,
            featured: req.body.featured,
            homepage: req.body.homepage,
            ingredients: req.body.ingredients,
            preparation: req.body.preparation,
            information: req.body.information,
        })

        //redirect to index
        const recipes = await Recipe.all()

        async function getImage(recipeId) {
            let recipeFiles = await RecipeFiles.findFiles(recipeId)
            const files = recipeFiles.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            )
            return files[0]
        }

        filesPromise = recipes.map(async recipe => {
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

async delete(req, res){

    try {
        const recipeFiles = await RecipeFiles.findAll({ where: {recipe_id: req.body.id} })

        const deleteFilesPromisse = recipeFiles.map(async recipeFile => {
            RecipeFiles.delete(recipeFile.id)
            const file = await File.find(recipeFile.file_id)                        
            unlinkSync(file.path)
            File.delete(file.id)
        })
        await Promise.all(deleteFilesPromisse)
    
        await Recipe.delete(req.body.id)

        //redirect to index        
        const recipes = await Recipe.all()

        async function getImage(recipeId) {
            let recipeFiles = await RecipeFiles.findFiles(recipeId)
            const files = recipeFiles.map(file =>
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
