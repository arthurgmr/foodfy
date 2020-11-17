const { age, date} = require("../../lib/utils.js")
const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {

    async index(req, res){
        try {
            let results = await Chef.all()
            const chefs = results.rows.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))
    
            return res.render("admin/chefs/index", {chefs})

        }catch(err) {
            console.log(err)
        }
    },

    create(req, res){
        return res.render("admin/chefs/create")
    },

    async post(req, res){
        const keys = Object.keys(req.body)

        for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields!')
            }
        }

        //VERIFICAR O SCRIPT NO FRONTEND;
        //IMG NÃO ESTÁ FICANDO NO FIELD;

        try {
            
            let results = await File.create(...req.files)
            const fileId = results.rows[0].id
            
            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)

        }catch(err) {
            console.log(err)
        }

    },

    async show(req, res){
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
                
            if(!chef) return res.send("Chef not found!")

            chef.created_at = date(chef.created_at).format

            results = await Chef.file(chef.file_id)
            const file = results.rows.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            results = await Chef.recipesAll(chef.id)
            const recipes = results.rows
                    
            return res.render("admin/chefs/show", {chef, recipes, file})

        }catch(err) {
            console.log(err)
        }

    },

    async edit(req, res){
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send("Ricipe not found!")

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

        for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields!')
            }
        }

        if(req.files.length != 0) {
            let results = await File.create(...req.files)
            const fileId = results.rows[0].id

            await File.delete(req.body.idFile)

            await Chef.updateFile(req.body, fileId)

        } else {

            await Chef.updateFields(req.body)
        } 

        return res.redirect(`/admin/chefs/${req.body.id}`)

    },

    async delete(req, res){
        await Chef.delete(req.body.id)

        return res.redirect("/admin/chefs")
    },
}
