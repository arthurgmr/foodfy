const { age, date} = require("../../lib/utils.js")
const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")



module.exports = {
    
    async index(req, res){
        const index_banner = {
            title_banner: 'The better recipes',
            description_banner: 'Learn how to build the best dishes with recipes created by professionals from around the world.',
            img_banner: '/assets/chef.png'
        }
        let results = await Recipe.all()
        const recipes = results.rows

        return res.render("guest/index",{recipes, index_banner} )

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
            return res.render("guest/about", {data_about})
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

        let results = await Recipe.paginate(params)
        const recipes = results.rows
        const pagination = {
            total_recipes: Math.ceil(recipes[0].total / limit),
            page
        }
        return res.render("guest/recipes",{recipes, pagination} )

    },

    async recipesShow(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
            
        if(!recipe) return res.send("Ricipe not found!")

        return res.render("guest/show-recipe", {recipe})

    },

    async chefs(req, res) {
        let results = await Chef.all() 
        const chefs = results.rows
        
        return res.render("guest/chefs", {chefs})

    },

    async chefsShow(req, res){
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if(!chef) return res.send("Chef not found!")

        chef.created_at = date(chef.created_at).format

        results = await Chef.recipesAll(req.params.id)
        const recipes = results.rows
        
        
        return res.render("guest/show-chef", {chef, recipes})

    },

    async searchRecipe(req, res) {
        const {filter} = req.query

        if (filter) {
            let results = await Recipe.findBy(filter)
            const recipes = results.rows
            
            return res.render("guest/search-recipe", {recipes, filter})

        } else {
            this.recipes
        }
    }

    
}