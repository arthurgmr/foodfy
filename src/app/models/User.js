const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM users
            ORDER BY name DESC
        `)
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            //get filters = WHERE | OR | AND
            query = `${query}
            ${key}
            `

            //get field, this case is email
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async create(data) {
        const query = `
        INSERT INTO users (
            name,
            email,
            password,
            is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
        `

        //hash of password
        const passwordHash = await hash(data.password, 8)
        
        const values = [
            data.name,
            data.email,
            passwordHash,
            data.is_admin
        ]

        const results = await db.query(query, values)
        return results.rows[0].id


    },
    async update(id, fields) {

        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }else {
                //last interation
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })
        await db.query(query)
    }
}