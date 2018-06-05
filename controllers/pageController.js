import { Page } from 'models'
import { assign, unlink } from 'modules'
import { ERROR, FILETYPE } from 'enum'

export async function all (req, res) {
    try {
        let pages = await Page.find().sort('-createdAt')

        return res.json({ pages })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function get (req, res) {
    try {
        const page = await Page.findOne({ key: req.params.key })

        if (!page) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ Էջի սերիա:'
            })
        }

        return res.json({ page })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

// export async function add (req, res) {
//     try {
//         let page = await new Page()

//         page.key = req.body.key
//         await assign(page, req, Page)
        
//         return res.json({ page })
//     } catch (e) {
//         console.log(e)
//         return res.send(e)
//     }
// }

export async function update (req, res) {
    try {
        let page = await Page.findById(req.params.id)

        if (!page) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ Էջի սերիա:'
            })
        }

        if (Object.keys(req.files).length !== 0) {
            let path = req.files.image[0].path
            let fileType = path.split('.')

            if (!FILETYPE.includes(fileType[1].toLowerCase())) {
                unlink(path)
                return res.status(ERROR.INVALID_DATA).json({
                    status: ERROR.INVALID_DATA,
                    message: 'Սխալ ֆայլի տեսակ է:'
                })
            }
        }

        await assign(page, req, Page)

        return res.json({ page })
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
