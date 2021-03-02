const { unlinkSync } = require("fs")

const Chef = require("../models/Chef")
const File = require("../models/File")
const Recipe = require("../models/Recipe.js")
const RecipeFiles = require("../models/RecipeFiles")

const { date, formatCpf, formatPhone} = require("../../lib/utils.js")

module.exports = {

    async index(req, res){
        try {
            //show all chef;
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))

            isAdmin = req.session.isAdmin
    
            return res.render("admin/chefs/index", { chefs, isAdmin })

        }catch(err) {
            console.log(err)
            return res.render("admin/chefs/index", {
                isAdmin: req.session.isAdmin,
                error: "Sorry, something went wrong. Contact your administrator."
            })
        }
    },

    create(req, res){
        try {
            isAdmin = req.session.isAdmin

            return res.render('admin/chefs/create', { isAdmin })

        }catch(err) {
            console.log(err)
            return res.render('admin/chefs/create', {
                isAdmin: req.session.isAdmin,
                error: "Sorry, something went wrong. Contact your administrator."
            })
        }

    },

    async post(req, res){

        try {
            //save file;
            const filePromise = req.files.map(file => {
                const fileId = File.create({ name: file.filename, path: file.path })
                return fileId
            })
            const fileId = await Promise.all(filePromise)            

            //save chef;
            await Chef.create({
                name: req.body.name,
                cpf: req.body.cpf.replace(/\D/g,""),
                phone: req.body.phone.replace(/\D/g,""),
                email: req.body.email,
                file_id: fileId[0]  
            })

            //redirect to index
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))

            isAdmin = req.session.isAdmin
    
            return res.render("admin/chefs/index", { 
                chefs, 
                isAdmin,
                success: "Chef successfully created!"
            })

        }catch(err) {
            console.log(err)
            return res.render('admin/chefs/create', {
                isAdmin: req.session.isAdmin,
                chef: req.body,
                error: "Sorry, something went wrong. Contact your administrator."
            })
        }

    },

    async show(req, res){
        try {
            //get data chef;
            const chef = await Chef.findChef(req.params.id)
  
            if(!chef) return res.redirect("/admin/chefs")

            //format date;
            chef.created_at = date(chef.created_at).format
            //format cpf;
            chef.cpf = formatCpf(chef.cpf)
            //format phone;
            chef.phone = formatPhone(chef.phone)


            //get file of chef and add src;
            let file = await File.findAll(chef.file_id)
            file = file.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            const recipes = await Recipe.findAll({where: {chef_id: chef.id}})

            //function for get image recipe chef's

            async function getImage(recipeId) {
                let recipeFiles = await RecipeFiles.findFiles(recipeId)
                recipeFiles = recipeFiles.map(file =>
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                )
                return recipeFiles[0]
            }

            //promise to wait run function getImageRecipe;
            const filesRecipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)
                return recipe
            })
            
            const recipesWithImages = await Promise.all(filesRecipesPromise)

            isAdmin = req.session.isAdmin
                    
            return res.render("admin/chefs/show", {chef, recipes: recipesWithImages, file, isAdmin})

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
            //find chef with id;
            const chef = await Chef.find(req.params.id)

            //format cpf;
            chef.cpf = formatCpf(chef.cpf)
            //format phone;
            chef.phone = formatPhone(chef.phone)

            if(!chef) return res.send("Ricipe not found!") //create page of not found;

            //get file of chef and add src;
            let file = await File.findAll(chef.file_id)
            file = file.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            isAdmin = req.session.isAdmin

            return res.render("admin/chefs/edit", {chef, file, isAdmin})
            
        }catch(err) {
            console.log(err)
            return res.render("admin/chefs/index", {
                isAdmin: req.session.isAdmin,
                error: "Sorry, something went wrong. Contact your administrator."
            })
        }

    },

    async put(req, res){
        try {
            //check exists a send new file;
            if(req.files.length != 0) {
                //save file;
                const filePromise = req.files.map(file => {
                    const fileId = File.create({ name: file.filename, path: file.path })
                    return fileId
                })
                const fileId = await Promise.all(filePromise)  
            
                //delete archive old;    
                await File.delete(req.body.idFile)
                
                //update chef with a new fileId;    
                await Chef.update(req.body.id, {
                    name: req.body.name,
                    cpf: req.body.cpf.replace(/\D/g,""),
                    phone: req.body.phone.replace(/\D/g,""),
                    email: req.body.email,
                    file_id: fileId  
                })
    
            } else {
                
                //update chef without fileId;
                await Chef.update(req.body.id, {
                    name: req.body.name,
                    cpf: req.body.cpf.replace(/\D/g,""),
                    phone: req.body.phone.replace(/\D/g,""),
                    email: req.body.email 
                })
            }
            
            //redirect to index
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))

            isAdmin = req.session.isAdmin
    
            return res.render("admin/chefs/index", { 
                chefs, 
                isAdmin,
                success: "Chef successfully updated!"
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
        
        try{
            const file = await File.find(req.body.idFile)
            unlinkSync(file.path)

            await File.delete(req.body.idFile)

            await Chef.delete(req.body.id)

            //redirect to index
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))

            //redirect to index chef;
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))

            isAdmin = req.session.isAdmin
    
            return res.render("admin/chefs/index", { 
                chefs, 
                isAdmin,
                success: "Chef successfully deleted!"
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
