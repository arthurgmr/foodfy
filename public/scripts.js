
/* SCRIPT MENU BOLD */

const currentPage = location.pathname
const menuItens = document.querySelectorAll("header div #menu")


for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
    }
} 

/* PAGINATE OF RECIPES */

function paginate(selectedPage, totalPages) {
    let pages = [],
    oldPage

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

            const firstAndLastPage = currentPage == 1 || currentPage == totalPages
            const pagesAfterSelectedPage = currentPage <= selectedPage + 2
            const pagesBeforeSelectedPage = currentPage >= selectedPage - 2


            if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
        
                if (oldPage && currentPage - oldPage > 2) {
                    pages.push("...")
                }

                if (oldPage && currentPage - oldPage == 2) {
                    pages.push(oldPage + 1)
                }

        pages.push(currentPage)

        oldPage = currentPage
            }
        }
return pages
}

function createPagination (pagination) {
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            elements += `<a href="?page=${page}">${page}</a>`
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if(pagination) {
    createPagination(pagination)
}

/* SHOW AND HIDE BUTTON*/
/* INGREDIENTS */


function showAndHideIngredients() {
    
    const showingr = document.querySelector('.showingr')
    const hideingr = document.querySelector('.hideingr')


    hideingr.addEventListener("click", function () {
        showingr.classList.remove('active')
        hideingr.classList.add('active')
        ingredients.classList.add('active')
    })

    showingr.addEventListener("click", function (){
        showingr.classList.add('active')
        hideingr.classList.remove('active')
        ingredients.classList.remove('active')
    })
}
const ingredients = document.querySelector('.ingredients')

if(ingredients) {
    showAndHideIngredients()
}

/* PREPARATION */

function showAndHidePreparation () {
    
    const showprep = document.querySelector('.showprep')
    const hideprep = document.querySelector('.hideprep')


    showprep.addEventListener("click", function (){
        showprep.classList.add('active')
        hideprep.classList.remove('active')
        preparation.classList.remove('active')
    })

    hideprep.addEventListener("click", function () {
        showprep.classList.remove('active')
        hideprep.classList.add('active')
        preparation.classList.add('active')
    })

}

const preparation = document.querySelector('.preparation.active')

if(preparation) {
    showAndHidePreparation ()
}

/* INFORMATION */

function showAndHideInformation() {
    const showinf = document.querySelector('.showinf')
    const hideinf = document.querySelector('.hideinf')


    hideinf.addEventListener("click", function () {
        showinf.classList.remove('active')
        hideinf.classList.add('active')
        information.classList.add('active')
    })

    showinf.addEventListener("click", function (){
        showinf.classList.add('active')
        hideinf.classList.remove('active')
        information.classList.remove('active')
    })
}

const information = document.querySelector('.information')

if(information) {
    showAndHideInformation()
}



