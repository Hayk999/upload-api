import fs from 'fs'

export async function assign (receiver, content, model) {
    try {
        Object.entries(content.body).forEach(([key, value]) => {
            if (!model.protectedFields.includes(key)) {
                if (model.translatable && model.translatable.includes(key)) {
                    let data
                    try {
                        data = JSON.parse(value)
                    } catch (e) {
                        data = value
                    }

                    receiver[key].am = data.am
                    receiver[key].en = data.en
                    receiver[key].ru = data.ru
                } else {
                    receiver[key] = value
                
                    if (model.schema.paths[key]) {
                        let name = model.schema.paths[key].constructor.address

                        if (name === 'ObjectId') {
                            if (!value) receiver[key] = undefined
                        } else if (name === 'SchemaArray') {
                            if (!value.length) receiver[key] = undefined
                        }
                    }
                }
            }
        })
        
        let images = []
        let previousImages = []
        if (content.files) {
            Object.entries(content.files).forEach(([key, image]) => {
                previousImages.push(receiver[key])
                if (image.length > 1) {
                    Object.values(image).forEach(element => {
                        images.push(element.path)
                    })
                    receiver[key] = images
                } else {
                    receiver[key] = content.files[key][0].path
                }
                images = []
            })
        }

        await receiver.save()
        for (let image of previousImages) {
            unlink(image)
        }
    } catch (e) {
        console.log(e)
        return Promise.reject(e)    
    }
}

export function unlink (path) {
    if (path && fs.existsSync(path)) {
        return fs.unlink(path)
    }

    return Promise.resolve()
}
