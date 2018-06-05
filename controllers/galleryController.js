import { Gallery } from 'models'
import { assign, unlink, unlinkForCatch } from 'modules'
import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let galleries = await Gallery.find({}).populate('collections').sort('order')

        return res.json({ galleries })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let gallery = new Gallery()
        let galleries = await Gallery.count()

        req.body.order = parseInt(galleries + 1)

        await assign(gallery, req, Gallery)
        
        return res.json({ gallery: req.body })
    } catch (e) {
        if (req.files) {
            Object.entries(req.files).forEach(([key, value]) => {
                unlink(value[0].path)
            })
        }

        console.log(e)
        return res.send(e)
    }
}

export async function get (req, res) {
    try {
        const gallery = await Gallery.findById(req.params.id).populate('collections')

        if (!gallery) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ նկարի սերիա:'
            })
        }

        return res.json({ gallery })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let gallery = await Gallery.findById(req.params.id)

        if (!gallery) {
            await unlinkForCatch(req.files)
            
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ նկարի սերիա:'
            })
        }

        await assign(gallery, req, Gallery)

        return res.json({ gallery })
    } catch (e) {
        if (req.files) {
            Object.entries(req.files).forEach(([key, value]) => {
                unlink(value[0].path)
            })
        }

        console.log(e)
        return res.send(e)
    }
}

export async function remove (req, res) {
    try {
        const gallery = await Gallery.findById(req.params.id)

        if (!gallery) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ նկարի սերիա:'
            })            
        }

        await unlink(gallery.image)
        await gallery.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
