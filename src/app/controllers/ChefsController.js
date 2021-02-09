const { date, formatCpf, formatPhone} = require("../../lib/utils.js")
const Chef = require("../models/Chef")
const File = require("../models/File")
const Recipe = require("../models/Recipe.js")

module.exports = {

    async index(req, res){
        try {
            //show all chef;
            let results = await Chef.all()
            const chefs = results.rows.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))
    
            return res.render("admin/chefs/index", { chefs })

        }catch(err) {
            console.log(err)
        }
    },
    create(req, res){
        return res.render("admin/chefs/create")
    },
    async post(req, res){
        const keys = Object.keys(req.body)

        //checking fill in all fields;
        for (key of keys) {
            if (req.body[key] == "") {
                return res.render('admin/chefs/create', {
                    chef: req.body,
                    error: 'Please, fill all fields!'
                })
            }
        }

        //checking send file;
        if(req.files.length == 0)
            return res.render('admin/chefs/create', {
                chef: req.body,
                error: 'Please, send at least one image!'
            })

        try {
            
            //save file;
            let results = await File.create(...req.files)
            const fileId = results.rows[0].id
            
            //save chef;
            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)

        }catch(err) {
            console.log(err)
        }

    },

    async show(req, res){
        try {
            //get data chef;
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            //check existent the chef;    
            if(!chef) return res.send("Chef not found!")

            //format date;
            chef.created_at = date(chef.created_at).format
            //format cpf;
            chef.cpf = formatCpf(chef.cpf)
            //format phone;
            chef.phone = formatPhone(chef.phone)


            //get file of chef and add src;
            results = await Chef.file(chef.file_id)
            const file = results.rows.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            results = await Chef.recipesAll(chef.id)
            const recipes = results.rows
            
            //function for get image recipe chef's
            async function getImageRecipe(recipeId) {
                let results = await Recipe.files(recipeId)
                const filesRecipes = results.rows.map(file =>
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                )
                return filesRecipes[0]
            }

            //promise to wait run function getImageRecipe;
            const filesRecipesPromise = recipes.map(async recipe => {
                recipe.image = await getImageRecipe(recipe.id)
                return recipe
            })
            
            const recipesWithImages = await Promise.all(filesRecipesPromise)
                    
            return res.render("admin/chefs/show", {chef, recipes: recipesWithImages, file})

        }catch(err) {
            console.log(err)
        }

    },

    async edit(req, res){
        try {
            //find chef with id;
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send("Ricipe not found!") //create page of not found;

            //get file of chef and add src;
            results = await Chef.file(chef.file_id)
            const file = results.rows.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/chefs/edit", {chef, file})
            
        }catch(err) {
            console.log(err)
        }

    },

    async put(req, res){
        const keys = Object.keys(req.body)

        //checking fill in all fields;
        for (key of keys) {
            if (req.body[key] == "") {
                return res.render('admin/chefs/create', {
                    chef: req.body,
                    error: 'Please, fill all fields!'
                })
            }
        }

        try {
            //check exists a send new file;
            if(req.files.length != 0) {
                //if yes, save new file;
                let results = await File.create(...req.files)
                const fileId = results.rows[0].id
            
                //delete archive old;    
                await File.delete(req.body.idFile)
                
                //update chef with a new fileId;    
                await Chef.updateFile(req.body, fileId)
    
            } else {
                
                //update chef without fileId;
                await Chef.updateFields(req.body)
            } 
    
            return res.redirect(`/admin/chefs/${req.body.id}`)

        }catch(err) {
            console.log(err)
        }

    },

    async delete(req, res){
        
        try{
            await File.delete(req.body.idFile)
            await Chef.delete(req.body.id)

            return res.redirect("/admin/chefs")
        }catch(err) {
            console.log(err)
        }
    },
}
