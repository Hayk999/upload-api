import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const areaSchema = new Schema({
    address: {
        en: {
            type: String,
            default: ''
        },
        am: {
            type: String,
            default: ''
        },
        ru: {
            type: String,
            default: ''
        }
    },
    code: {
        type: String,
        unique: true,
        required: [true, ERR_MSG.CODE]
    },
    headerImage: {
        type: String,
        required: [true, ERR_MSG.HEAD_IMAGE],
        validate: {
            validator: (value) => {
                return /\.(gif|jpg|jpeg|tiff|png)$/i.test(value)
            },
            message: ERR_MSG.IMAGE
        }
    },
    collections: {
        type: Schema.Types.ObjectId,
        required: [true, ERR_MSG.COLLECTION],
        ref: 'Collection'
    },
    areaSurface: {
        type: Number,
        required: [true, ERR_MSG.SIZE]
    },
    images: [String],
    description: {
        en: {
            type: String,
            default: ''
        },
        am: {
            type: String,
            default: ''
        },
        ru: {
            type: String,
            default: ''
        }
    },
    price: {
        type: Number,
        min: [1, ERR_MSG.PRICE],
        required: [true, ERR_MSG.REQUIRED_PRICE]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

areaSchema.statics.protectedFields = ['_id', '__v', 'createdAt']
areaSchema.statics.translatable = ['address', 'description']

export default mongoose.model('Area', areaSchema)
