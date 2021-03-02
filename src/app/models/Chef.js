const db = require("../../config/db")
const { age, date} = require("../../lib/utils.js")

const Base = require('./Base')

Base.init({ table: 'chefs' })


 
 module.exports = {
     
    ...Base,

    async all() {        
        const results = await db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes, files.path AS file_path
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            LEFT JOIN files ON (chefs.file_id = files.id)
            GROUP BY chefs.id, files.path
            ORDER BY created_at DESC `)
        return results.rows
    },

    async findChef(id) {
        const results = await db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
        return results.rows[0]
    },


}