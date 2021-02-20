const db = require("../../config/db")
const { age, date} = require("../../lib/utils.js")

 
 module.exports = {
    all() {        
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes, files.path AS file_path
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		LEFT JOIN files ON (chefs.file_id = files.id)
        GROUP BY chefs.id, files.path
        ORDER BY created_at DESC `)
    },

    create(data, fileId) {
        const query = `
        INSERT INTO chefs (
            name,
            cpf,
            phone,
            email,
            file_id
        ) VALUES ($1, $2, $3, $4, $5)   
        RETURNING id
    `
        data.cpf = data.cpf.replace(/\D/g,"")
        data.phone = data.phone.replace(/\D/g,"")
        
        const values = [
            data.name,
            data.cpf,
            data.phone,
            data.email,
            fileId
        ]

    return db.query(query, values)

    },

    find(id) {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id])
    },

    updateFields(data, fileId) {
        const query = `
            UPDATE chefs SET
            name=($1),
            cpf=($2),
            phone=($3),
            email=($4)
            WHERE id = $5
        `

        const values = [
            data.name,
            data.cpf,
            data.phone,
            data.email,         
            data.id
        ]

        return db.query(query, values)
    },

    updateFile(data, fileId) {
        const query = `
            UPDATE chefs SET
            name=($1),
            cpf=($2),
            phone=($3),
            email=($4),
            file_id=($5)
            WHERE id = $6
        `

        const values = [
            data.name,
            data.cpf,
            data.phone,
            data.email,
            fileId,            
            data.id
        ]

        return db.query(query, values)
    },

    delete(id) {
        
        return db.query(`DELETE FROM chefs WHERE id=$1`, [id])
    },

    recipesAll(id) {
       return db.query(`
            SELECT *
            FROM recipes
            WHERE recipes.chef_id = $1
            ORDER BY created_at DESC`, [id])
    },

    file(id) {
        return db.query (`
            SELECT * FROM files WHERE id = $1`, [id])
    }
}