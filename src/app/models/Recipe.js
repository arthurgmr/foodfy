const db = require("../../config/db")

 module.exports = {
    all(data) {
        
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        GROUP BY recipes.id, chefs.name
        ORDER BY created_at DESC `)
    },

    create(data) {
        const query = `
        INSERT INTO recipes (
            title,
            chef_id,
            user_id,
            featured,
            homepage,
            ingredients,
            preparation,
            information
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)   
        RETURNING id    
    `
        const values = [
            data.title,
            data.chef_id,
            data.user_id,
            data.featured,
            data.homepage,
            data.ingredients,
            data.preparation,
            data.information
        ]

        return db.query(query, values) 
    },

    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id]
        )
    },

    findBy(filter) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'`)
    },
    
    findRecipeOfUser(id) {
        return db.query(`
            SELECT * 
            FROM recipes 
            WHERE user_id = $1`, [id]
        )
    },

    update(data) {
        const query = `
            UPDATE recipes SET
            title=($1),
            chef_id=($2),
            featured=($3),
            homepage=($4),
            ingredients=($5),
            preparation=($6),
            information=($7)
            WHERE id = $8
        `

        const values = [
            data.title,
            data.chef_id,
            data.featured,
            data.homepage,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

    return db.query(query, values)
    },

    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id=$1`, [id])
    },

    chefsSelectOptions() {
       return db.query(`SELECT name, id FROM chefs`)
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
    
        
    },

    files(recepeId) {
        return db.query (`
            SELECT recipe_files.*, files.*
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1`, [recepeId])
    }
}