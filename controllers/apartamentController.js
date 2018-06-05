import { Apartament } from 'models'
import { assign, unlink } from 'modules'
import {
    checkImageType,
    editGallery,
    unlinkForCatch
} from 'modules/helpers'

import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let apartaments = await Apartament.find().populate('collections').sort('-createdAt')

        return res.json({ apartaments })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let apartament = new Apartament()

        let check = await checkImageType(req.files)

        if (check) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }
        
        await assign(apartament, req, Apartament)
        
        return res.json({ apartament })
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
        const apartaments = await Apartament.findById(req.params.id).populate('collections')

        if (!apartaments) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        return res.json({ apartaments })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let apartament = await Apartament.findById(req.params.id)

        let check = await checkImageType(req.files)

        if (check) {
            await unlinkForCatch(req.files)

            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }

        if (!apartament) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ սերիա:'
            })
        }

        let images = await editGallery(req.body.oldImagesPath, apartament.images, req.files.images)

        delete req.files.images
        req.body.images = images
        await assign(apartament, req, Apartament)

        return res.json({ apartament })
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
        const apartament = await Apartament.findById(req.params.id)

        if (!apartament) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ  սերիա:'
            })
        }

        if (typeof apartament.images === 'object') {
            apartament.images.forEach(image => {
                unlink(image)
            })
        }

        unlink(apartament.headerImage)

        await apartament.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
