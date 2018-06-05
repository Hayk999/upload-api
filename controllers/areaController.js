import { Area } from 'models'
import { assign, unlink } from 'modules'
import {
    checkImageType,
    editGallery,
    unlinkForCatch
} from 'modules/helpers'

import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let areas = await Area.find().populate('collections').sort('-createdAt')

        return res.json({ areas })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let area = new Area()

        let check = await checkImageType(req.files)

        if (check) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }
        
        await assign(area, req, Area)
        
        return res.json({ area })
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
        const areas = await Area.findById(req.params.id).populate('collections')

        if (!areas) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ մատանիի սերիա:'
            })
        }

        return res.json({ areas })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let area = await Area.findById(req.params.id)

        let check = await checkImageType(req.files)

        if (check) {
            await unlinkForCatch(req.files)

            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ ֆայլի տեսակ է:'
            })
        }

        if (!area) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ մատանիի սերիա:'
            })
        }

        let images = await editGallery(req.body.oldImagesPath, area.images, req.files.images)

        delete req.files.images
        req.body.images = images
        await assign(area, req, Area)

        return res.json({ area })
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
        const area = await Area.findById(req.params.id)

        if (!area) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ մատանիի սերիա:'
            })
        }

        if (typeof area.images === 'object') {
            area.images.forEach(image => {
                unlink(image)
            })
        }

        unlink(area.headerImage)

        await area.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
