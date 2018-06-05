import { Collection } from 'models'
import { assign } from 'modules'
import { ERROR } from 'enum'

export async function all (req, res) {
    try {
        let collections = await Collection.find().sort('-createdAt')

        return res.json({ collections })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function add (req, res) {
    try {
        let collection = new Collection()
        
        await assign(collection, req, Collection)
        
        return res.json({ collection })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function get (req, res) {
    try {
        const collection = await Collection.findById(req.params.id)

        if (!collection) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ հավաքածուի սերիա:'
            })            
        }

        return res.json({ collection })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function update (req, res) {
    try {
        let collection = await Collection.find({
            _id: req.params.id,
            protected: false
        })

        if (!collection || collection.protected) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ հավաքածուի սերիա:'
            })            
        }

        await assign(collection, req, Collection)

        return res.json({ collection })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

export async function remove (req, res) {
    try {
        const collection = await Collection.findById(req.params.id)

        if (!collection || collection.protected) {
            return res.status(ERROR.INVALID_DATA).json({
                status: ERROR.INVALID_DATA,
                message: 'Սխալ հավաքածուի սերիա:'
            })
        }

        await collection.remove()
        
        return res.json({ success: true })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
