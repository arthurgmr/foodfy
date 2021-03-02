const db = require("../../config/db")

const Base = require('./Base')

Base.init({ table: 'recipes' })


 module.exports = {

    ...Base,

    async all() {
        const results = await db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            GROUP BY recipes.id, chefs.name
            ORDER BY created_at DESC `)
        return results.rows
    },

    async findRecipe(id) {
        const results = await db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
        return results.rows[0]
    },

    findBy(filter) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'`)
    },

    paginate(params) {
        const { limit, offset } = params

        let query = `
        SELECT recipes.*, (
            SELECT count(*) FROM recipes
        ) AS total, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY updated_at DESC
        LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset])
    
        
    }
}