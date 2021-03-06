const db = require('../../config/db')

function find (filters, table) {
    let query = `SELECT * from ${table}`

    if(filters) {
        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })
    }    
    return db.query(query)
}

const Base = {
    
    init({ table }) {
        if(!table) throw new Error('Invalid Params')

        this.table = table

        return table
    },
    async find(id) {
        const results = await find({ where: {id}}, this.table)
        return results.rows[0]      
    },
    async findOne(filters) {
        const results = await find(filters, this.table)
        return results.rows[0]      
    },
    async findAll(filters) {
        const results = await find(filters, this.table)
        return results.rows      
    },
    async create(fields) {
        try {
            let keys = [],
                values = []

            Object.keys(fields).map(key => {
                //keys = name, age, address
                //values = 'Valeska', '30', 'Rua Alguma Coisa'
                keys.push(key)
                
                if (Array.isArray(fields[key])) {
                    const separetWithComma = '","'
                    values.push(`'{"${fields[key].join(separetWithComma)}"}'`)
                } else {
                    values.push(`'${fields[key]}'`)
                }
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id`

            const results = await db.query(query)
            return results.rows[0].id

        }catch(err) {
            console.log(err)
        }
    },
    update(id, fields) {
        try {
            let values = []

            Object.keys(fields).map(key => {
                if (Array.isArray(fields[key])) {
                    const separetWithComma = '","'
                    values.push(`${key} = '{"${fields[key].join(separetWithComma)}"}'`)
                } else {
                    values.push(`${key} = '${fields[key]}'`)
                }
            })

            let query = `UPDATE ${this.table} SET
                ${values.join(',')}
                WHERE id = ${id}
            `
            return db.query(query)

        }catch(err) {
            console.log(err)
        }
    },
    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])    
    }
}

module.exports = Base