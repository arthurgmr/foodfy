const { date } = require("../../lib/utils.js")
const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const { all } = require("../models/Recipe")



module.exports = {
    
    async index(req, res){
        const index_banner = {
            title_banner: 'The better recipes',
            description_banner: 'Learn how to build the best dishes with recipes created by professionals from around the world.',
            img_banner: '/assets/chef.png'
        }
        try {
            let results = await Recipe.all()
            let recipes = results.rows

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
        limit = limit || 9
        let offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset   
        }

        try {
            let results = await Recipe.paginate(params)
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
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]            
                
            if(!recipe) return res.send("Ricipe not found!")

            results = await Recipe.files(req.params.id)
            const files = results.rows.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
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
            let results = await Chef.all()
            const chefs = results.rows.map(chef => ({
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
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            //check existent the chef;    
            if(!chef) return res.send("Chef not found!")

            //format date;
            chef.created_at = date(chef.created_at).format

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

            //
            const filesRecipesPromise = recipes.map(async recipe => {
                recipe.image = await getImageRecipe(recipe.id)
                return recipe
            })
            
            const recipesWithImages = await Promise.all(filesRecipesPromise)

            console.log(recipes)
                    
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
                let results = await Recipe.findBy(filter)
                const recipes = results.rows          
        
                results = await Recipe.files(req.params.id)
                const files = results.rows.map(file => ({
                    ...file,
                    src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }))
                
            return res.render("public/search-recipe", {recipes,files, filter})
        
            }catch(err) {
                console.log(err)
                return res.render("public/search-recipe", {
                    error: "Some error happened!"
                })
            }

        } else {
            this.recipes
        }
    }

    
}