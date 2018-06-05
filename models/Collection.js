import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const collectionSchema = new Schema({
    name: {
        en: {
            type: String,
            required: [true, `[en] ${ERR_MSG.NAME}`]
        },
        am: {
            type: String,
            required: [true, `[am] ${ERR_MSG.NAME}`]
        }
    },
    protected: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

collectionSchema.statics.protectedFields = ['_id', '__v', 'protected', 'createdAt']
collectionSchema.statics.translatable = ['name']

collectionSchema.statics.seed = async function () {
    try {
        const collection = await this.find()

        if (!collection.length) {
            let collection = new this({
                name: {
                    en: 'Another',
                    am: 'Այլ'
                },
                protected: true
            })

            await collection.save()
        }
    } catch (e) {
        console.log(e)
    }
}

const Collection = mongoose.model('Collection', collectionSchema)

Collection.seed()

export default Collection
