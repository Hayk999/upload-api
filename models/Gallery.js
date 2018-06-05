import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const gallerySchema = new Schema({
    title: {
        en: {
            type: String,
            required: [true, `[en] ${ERR_MSG.TITLE}`]
        },
        am: {
            type: String,
            required: [true, `[am] ${ERR_MSG.TITLE}`]
        },
        ru: {
            type: String,
            required: [true, `[am] ${ERR_MSG.TITLE}`]
        }
    },
    // collections: {
    //     type: Schema.Types.ObjectId,
    //     required: [true, ERR_MSG.COLLECTION],
    //     ref: 'Collection'
    // },
    image: {
        type: String,
        validate: {
            validator: (value) => {
                return /\.(gif|jpg|jpeg|tiff|png)$/i.test(value)
            },
            message: ERR_MSG.IMAGE
        }
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

gallerySchema.statics.protectedFields = ['_id', 'createdAt']
gallerySchema.statics.translatable = ['title']

export default mongoose.model('Gallery', gallerySchema)
