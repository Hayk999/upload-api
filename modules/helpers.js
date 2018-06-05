import { unlink } from 'modules'
import { FILETYPE } from 'enum'

export function checkImageType (images) {
    let files = []
    let error = false

    Object.values(images).forEach(image => {
        Object.values(image).forEach(imagePath => {
            let fileType = imagePath.path.split('.')
            files.push(imagePath.path)
            if (!FILETYPE.includes(fileType[1].toLowerCase())) {
                error = true
                unlink(imagePath.path)
                files.splice(files.indexOf(imagePath.path), 1)
            }
        })
    })

    if (error && files.length) {
        for (let path of files) {
            unlink(path)
        }
    }

    return error
}

export function editGallery (oldImagesPaths, existsImages, newImagesPaths) {
    let oldImages = JSON.parse(oldImagesPaths)

    for (let path of oldImages) {
        if (existsImages.includes(path)) {
            unlink(path)
            existsImages.splice(existsImages.indexOf(path), 1)
        }
    }

    if (typeof newImagesPaths !== 'undefined') {
        for (let newPath of newImagesPaths) {
            existsImages.push(newPath.path)
        }
    }

    return existsImages
}

export function unlinkForCatch (images) {
    Object.values(images).forEach(image => {
        Object.values(image).forEach(imagePath => {
            unlink(imagePath.path)
        })
    })
}
