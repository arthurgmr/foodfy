const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const RecipeFile = require('./src/app/models/RecipeFiles')
const File = require('./src/app/models/File')

//config user
let usersIds = []
let totalUsers = 4

//config chef
let chefsIds = []
let totalChefs = 6
//function for create chef file's
async function createFileChef() {
    const fileId = await File.create({
        name: faker.random.number(999999),
        path: `public/images/placeholder.png`
    })
    return fileId
}

//config chef
let productsIds = []
let totalProducts = 10
//function for create recipe file's
async function createFileRecipe() {
    
}

let files = []



async function createUsers() {
    const users = []
    const password = await hash('123', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: faker.random.boolean()
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
    const chefs = []
    const fileId = await createFileChef()

    while (chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
            cpf: faker.random.number(99999999999),
            phone: faker.random.number(99999999999),
            email: faker.internet.email(),
            file_id: fileId
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

async function createProducts() {
    let products = []

    while (products.length < totalProducts) {
        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            old_price: faker.random.number(9999),
            price: faker.random.number(9999),
            quantity: faker.random.number(99),
            status: Math.round(Math.random())
        })
    }

    const productsPromise = products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromise)

    let files = []

    while(files.length < 50) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
    }
    
    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)
}

async function init() {
    await createUsers()
    await createChefs()
}

init()