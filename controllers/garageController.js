import { Garage } from 'models'
import { assign, unlink } from 'modules'
import {
    checkImageType,
    editGallery,
    unlinkForCatch
} from 'modules/helpers'

import { ERROR } from 'enum'

export async function all (req, res) {
       try {
           let garages = await Garage.find().populate('collections').sort('-createdAt')

           return res.json({ garages })
       } catch (e) {
           console.log(e)
           return res.send(e)
       }
}

export async function add (req, res) {
    try {
        let garage = new Garage()
        let check = await checkImageType(req.files)

        if (check) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }
        await assign(garage, req, Garage)
        
        return res.json({ garage })
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
        const garages = await Garage.findById(req.params.id).populate('collections')

        if (!garages) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ թևնոցի սերիա:'
            })
        }

        return res.json({ garages })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let garage = await Garage.findById(req.params.id)

        let check = await checkImageType(req.files)

        if (check) {
            await unlinkForCatch(req.files)

            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }

        if (!garage) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ թևնոցի սերիա:'
            })
        }

        let images = await editGallery(req.body.oldImagesPath, garage.images, req.files.images)

        delete req.files.images
        req.body.images = images
        await assign(garage, req, Garage)

        return res.json({ garage })
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
        const garage = await Garage.findById(req.params.id)

        if (!garage) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ թևնոցի սերիա:'
            })
        }

        if (typeof garage.images === 'object') {
            garage.images.forEach(image => {
                unlink(image)
            })
        }

        unlink(garage.headerImage)

        await garage.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
