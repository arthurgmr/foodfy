const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const RecipeFile = require('./src/app/models/RecipeFiles')
const File = require('./src/app/models/File')

//function for create file in file table
async function createFile() {
    const fileId = await File.create({
        name: faker.random.number(9999999999),
        path: `public/images/placeholder.png`
    })
    return fileId
}

//function for create date in recipe_files table

//config user
let usersIds = []
let totalUsers = 5

//config chef
let chefsIds = []
let totalChefs = 10

//config recipe
let totalRecipes = 30


async function createUsers() {
    const users = []
    const password = await hash('123', 8)
    const passwordAdmin = await hash('admin', 8)

    users.push({
        name: faker.name.firstName(),
        email: 'admin@foodfy.com',
        password: passwordAdmin,
        is_admin: true,
    })

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
    let chefs = []

    while (chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
            cpf: faker.random.number(99999999999),
            phone: faker.random.number(99999999999),
            email: faker.internet.email(),
            file_id: await createFile()
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes() {
    let recipes = []
    let recipeFiles = []
    let totalFileOfRecipe = 3

    while (recipes.length < totalRecipes) {
        //create recipe with return recipeId;
        recipes.push({
            title: faker.name.title(),
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            featured: faker.random.boolean(),
            homepage: faker.random.boolean(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(". ").map(ingredient => ingredient.replace(".", "")),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(". ").map(preparation => preparation.replace(".", "")),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    const recipeIds = await Promise.all(recipesPromise)

    while (recipeFiles.length < totalRecipes * totalFileOfRecipe) {
        recipeFiles.push({
            recipe_id: recipeIds[Math.floor(Math.random() * totalRecipes)],
            file_id: await createFile(),
        })
    }

    const recipeFilesPromise = recipeFiles.map(recipeFile => RecipeFile.create(recipeFile))
    await Promise.all(recipeFilesPromise)
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()