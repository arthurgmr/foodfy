

// BOLD EFFECT IN ITEMS OF MENU
const menuItens = document.querySelectorAll("header div #menu")
if(menuItens) {
    const currentPage = location.pathname
    for (item of menuItens) {
        if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
        }
    }
}

// INPUT MASKS
const Mask = {
    apply(input, func) {
        setTimeout(function (){
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatCPF(value) {
        return value
            .replace(/\D/g,"")
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1') //limit characters
    },
    formatPhone(value) {
        return value
            .replace(/\D/g,"")
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .replace(/(-\d{4})\d+?$/, '$1')

    }
}

// DELETE CONFIRMATION
const formDelete = document.querySelector("#form-delete")
if(formDelete) {
    formDelete.addEventListener("submit", function(event) {
        const confirmation = confirm("Do you want to delete the chef?")
            if(!confirmation) {
                event.preventDefault()
            }
    })
} 

/* ADMIN */
/* FUNÇÃO DE CLIQUE E REDIRECIONAMENTO PARA A EDITAR RECEITA */
/* OBS: com a utilização do bando de dados não foi necessário a utilização
deste script, porque dentro do banco contém a id; */

/* const recipes = document.querySelectorAll('.view_recipe')

for (let i = 0; recipes.length; i++) {
    recipes[i].addEventListener('click', function() {
        window.location.href = `/admin/${i}`
    })
} */

// ADD AND REMOVE INPUT INGREDIENT

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
    }

const addI = document.querySelector(".add-ingredient")
    if(addI) {
        addI.addEventListener("click", addIngredient);
    }

function removeIngredient() {
    const fieldContainer = document.querySelectorAll(".ingredient");
    const field = fieldContainer[fieldContainer.length - 1]

    if (fieldContainer.length == 1) {
        alert('It is not possible to remove all fields.')
    } else {
    field.remove()
    }
}
const removeI = document.querySelector(".remove-ingredient")
    if(removeI) {
        removeI.addEventListener("click", removeIngredient)
    }

// ADD AND REMOVE INPUT PREPARATION

function addPreparation() {
    const preparations = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparations.appendChild(newField);
    }

const addP = document.querySelector(".add-preparation")
    if(addP) {
        addP.addEventListener("click", addPreparation);
    }

function removePreparation() {
    const fieldContainer = document.querySelectorAll(".preparation")
    const field = fieldContainer[fieldContainer.length - 1]

    if (fieldContainer.length == 1) {
        alert('It is not possible to remove all fields.')
    } else {
    field.remove()
    }
}
const removeP = document.querySelector(".remove-preparation")
    if(removeP) {
        removeP.addEventListener("click", removePreparation)
    }


const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit (event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Upload only ${uploadLimit} photos!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Maximum 5 photos!")
            event.preventDefault()
            return true
        }


        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        console.log(event.target)
        console.log(photoDiv)
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

const PhotosUploadChef = {
    input: "",
    preview: document.querySelector('#avatar-preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUploadChef.input = event.target

        if(PhotosUploadChef.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            
            PhotosUploadChef.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUploadChef.getContainer(image)
                PhotosUploadChef.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUploadChef.input.file = PhotosUploadChef.getAllFile()
    },
    hasLimit (event) {
        const { uploadLimit, input, preview } = PhotosUploadChef
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Upload only ${uploadLimit} photo!`)
            event.preventDefault()
            return true
        }
        return false
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUploadChef.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUploadChef.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUploadChef.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUploadChef.files.splice(index, 1)
        PhotosUploadChef.input.files = PhotosUploadChef.getAllFile()

        photoDiv.remove()

    },
    getAllFile() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUploadChef.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        photoDiv.remove()
    }
}

// SET IMAGE ON RECIPES

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target} = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src

    }
}

const Lightbox = {
    target: document.querySelector('.highlight .lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top ="-100%"
        Lightbox.target.bottom = "initial"

    }

}