const db = require("../../config/db")
const fs = require("fs")

module.exports = {
    create({filename, path}) {
        const query = `
        INSERT INTO files (
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id    
    `
        const values = [
            filename,
            path
        ]

        return db.query(query, values) 
    },
    createRecipeFiles ({recipeId, fileId}) {
        const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        RETURNING id    
        `
        const values = [
            recipeId,
            fileId
        ]

        return db.query(query, values) 
    },
    findRecipeFiles(id) {
        return db.query(`
            SELECT * 
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id) 
            WHERE recipe_id = $1
        `, [id])
    },
    deleteRecipeFiles(id){
        return db.query(`DELETE FROM recipe_files WHERE file_id =$1`, [id])
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])

        }catch(err) {
            console.error(err)
        }
    }
 }