const db = require("../../config/db")
const fs = require("fs")

const Base = require('./Base')

Base.init({ table: 'recipe_files' })


module.exports = {
    
    ...Base,

    findFiles(recipeId) {
        const results = db.query (`
            SELECT recipe_files.*, files.*
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1`, [recipeId])
        return results.rows
    }
 }

// TESTAR

//  findRecipeFiles(id) {
//     return db.query(`
//         SELECT * 
//         FROM recipe_files
//         LEFT JOIN files ON (recipe_files.file_id = files.id) 
//         WHERE recipe_id = $1
//     `, [id])
// }