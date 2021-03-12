const Recipe = require("../models/Recipe")
const RecipeFiles = require("../models/RecipeFiles")
const Chef = require("../models/Chef")
const File = require("../models/File")

const { date } = require("../../lib/utils.js")

module.exports = {
    
    async index(req, res){
        const index_banner = {
            title_banner: 'The best recipes',
            description_banner: 'Learn how to build the best dishes with recipes created by professionals from around the world.',
            img_banner: '/assets/chef.png'
        }
        try {
            let recipes = await Recipe.all()

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
    
            recipes = await Promise.all(filesPromise)

            const recipe = recipes[0]

            return res.render("public/index",{recipes, recipe, index_banner} )

        }catch(err) {
            console.log(err)
            return res.render("public/index", {
                error: "Some error happened!"
            })
        }

    },

    about(req, res) {
        const data_about = {
            title_about: 'About Foodfy',
            description_about: [
            'Suspendisse placerat neque neque. Morbi dictum nulla non',
            'sapien rhoncus, et mattis erat commodo. Aliquam vel lacus',
            'a justo mollis luctus. Proin vel auctor eros, sed eleifend',
            'nunc. Curabitur eget tincidunt risus. Mauris malesuada ',
            'facilisis magna, vitae volutpat sapien tristique eu. Morbi ',
            'metus nunc, interdum in erat placerat, aliquam iaculis massa.',
            'Duis vulputate varius justo pharetra maximus. In vehicula enim ',
            'nec nibh porta tincidunt. Vestibulum at ultrices turpis, non',
            'dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod',
            'convallis augue.',
            '<br id="space"></br>',
            'Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan.',
            'Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus,',
            'rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan ',
            'felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ',
            'ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl ',
            'at accumsan. Donec libero neque, vulputate semper orci et, malesuada ',
            'sodales eros. Nunc ut nulla faucibus enim ultricies euismod.'
            ],
    
            title_start: 'How to started everthing',
            description_start: [
            'Suspendisse placerat neque neque. Morbi dictum nulla non',
            'sapien rhoncus, et mattis erat commodo. Aliquam vel lacus',
            'a justo mollis luctus. Proin vel auctor eros, sed eleifend',
            'nunc. Curabitur eget tincidunt risus. Mauris malesuada ',
            'facilisis magna, vitae volutpat sapien tristique eu. Morbi ',
            'metus nunc, interdum in erat placerat, aliquam iaculis massa.',
            'Duis vulputate varius justo pharetra maximus. In vehicula enim ',
            'nec nibh porta tincidunt. Vestibulum at ultrices turpis, non',
            'dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod',
            'convallis augue.',
            '<br id="space"></br>',
            'Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan.',
            'Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus,',
            'rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan ',
            'felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ',
            'ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl ',
            'at accumsan. Donec libero neque, vulputate semper orci et, malesuada ',
            'sodales eros. Nunc ut nulla faucibus enim ultricies euismod.'
            ],
    
            title_preparation: 'Ouir recipes',
            description_preparation: [
            'Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan.',
            'Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus,',
            'rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan ',
            'felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ',
            'ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl ',
            'at accumsan. Donec libero neque, vulputate semper orci et, malesuada ',
            'sodales eros. Nunc ut nulla faucibus enim ultricies euismod.'
            ],
        }       
            return res.render("public/about", {data_about})
    },

    async recipes(req, res) {
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset   
        }

        try {
            let recipes = await Recipe.paginate(params)

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

            const allRecipe = await Promise.all(filesPromise)

            const pagination = {
                total_recipes: Math.ceil(recipes[0].total / limit),
                page
            }
            return res.render("public/recipes",{recipes: allRecipe, pagination} )

        }catch(err) {
            console.log(err)
            return res.render("public/recipes", {
                error: "Some error happened!"
            })
        }
    },

    async recipesShow(req, res) {
        try {
            const recipe = await Recipe.findRecipe(req.params.id)    
                
            if(!recipe) return res.send("Ricipe not found!")

            let files = await RecipeFiles.findFiles(req.params.id)            
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))

            return res.render("public/show-recipe", {recipe, files})

        }catch(err) {
            console.log(err)
            return res.render("public/show-recipe", {
                error: "Some error happened!"
            })
        }

    },

    async chefs(req, res) {
        try {
            let chefs = await Chef.all()
            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }))
            return res.render("public/chefs", {chefs})

        }catch(err) {
            console.log(err)
            return res.render("public/chefs", {
                error: "Some error happened!"
            })
        }       

    },

    async chefsShow(req, res){
        try {
            //get data chef;
            const chef = await Chef.findChef(req.params.id)

            //check existent the chef;    
            if(!chef) return res.redirect("/chefs")

            //get file of chef and add src;
            let file = await File.findAll({where: {id: chef.file_id}})
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
                    
            return res.render("public/show-chef", {chef, recipes: recipesWithImages, file})

        }catch(err) {
            console.log(err)
            return res.render("public/show-chef", {
                error: "Some error happened!"
            })
        }    
    },

    async searchRecipe(req, res) {
        const {filter} = req.query

        if (filter) {

            try {
                let recipes = await Recipe.findBy(filter)

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

                recipes = await Promise.all(filesPromise)
                               
            return res.render("public/search-recipe", {recipes, filter})
        
            }catch(err) {
                console.log(err)
                return res.render("public/search-recipe", {
                    error: "Some error happened!"
                })
            }

        } else {
            console.log('here')
            this.recipes
        }
    }

    
}