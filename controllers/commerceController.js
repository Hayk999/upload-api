import { Commerce } from 'models'
import { assign, unlink } from 'modules'
import {
    checkImageType,
    editGallery,
    unlinkForCatch
} from 'modules/helpers'

import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let commerces = await Commerce.find().populate('collections').sort('-createdAt')

        return res.json({ commerces })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let commerce = new Commerce()

        let check = await checkImageType(req.files)

        if (check) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }
        
        await assign(commerce, req, Commerce)
        
        return res.json({ commerce })
    } catch (e) {
        if (req.files) {
            await unlinkForCatch(req.files)
        }

        console.log(e)
        if (e.code === 11000) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Կոդը պետք է չկրկնվի:'
            })
        }
        
        return res.send(e)
    }
}

export async function get (req, res) {
    try {
        const commerces = await Commerce.findById(req.params.id).populate('collections')

        if (!commerces) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        return res.json({ commerces })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let commerce = await Commerce.findById(req.params.id)

        let check = await checkImageType(req.files)

        if (check) {
            await unlinkForCatch(req.files)

            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }

        if (!commerce) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        let images = await editGallery(req.body.oldImagesPath, commerce.images, req.files.images)

        delete req.files.images
        req.body.images = images
        await assign(commerce, req, Commerce)

        return res.json({ commerce })
    } catch (e) {
        if (req.files) {
            await unlinkForCatch(req.files)
        }

        console.log(e)
        if (e.code === 11000) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Կոդը պետք է չկրկնվի:'
            })
        }

        console.log(e)
        return res.send(e)
    }
}

export async function remove (req, res) {
    try {
        const commerce = await Commerce.findById(req.params.id)

        if (!commerce) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        if (typeof commerce.images === 'object') {
            commerce.images.forEach(image => {
                unlink(image)
            })
        }

        unlink(commerce.headerImage)

        await commerce.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
