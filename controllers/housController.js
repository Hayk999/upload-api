import { Hous } from 'models'
import { assign, unlink } from 'modules'
import {
    checkImageType,
    editGallery,
    unlinkForCatch
} from 'modules/helpers'

import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let houses = await Hous.find().populate('collections').sort('-createdAt')

        return res.json({ houses })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let hous = new Hous()

        let check = await checkImageType(req.files)

        if (check) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }
        
        await assign(hous, req, Hous)
        
        return res.json({ hous })
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
        const houses = await Hous.findById(req.params.id).populate('collections')

        if (!houses) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ  սերիա:'
            })
        }

        return res.json({ houses })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let hous = await Hous.findById(req.params.id)

        let check = await checkImageType(req.files)

        if (check) {
            await unlinkForCatch(req.files)

            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }

        if (!hous) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        let images = await editGallery(req.body.oldImagesPath, hous.images, req.files.images)

        delete req.files.images
        req.body.images = images
        await assign(hous, req, Hous)

        return res.json({ hous })
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
        const hous = await Hous.findById(req.params.id)

        if (!hous) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        if (typeof hous.images === 'object') {
            hous.images.forEach(image => {
                unlink(image)
            })
        }

        unlink(hous.headerImage)

        await hous.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
