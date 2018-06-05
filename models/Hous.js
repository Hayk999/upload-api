import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const housSchema = new Schema({
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
    houseSurface: {
        type: Number,
        required: [true, ERR_MSG.SIZE]
    },
    areaSurface: {
        type: Number,
        required: [true, ERR_MSG.SIZE]
    },
    houseTax: {
        type: Number,
        required: [true, ERR_MSG.SIZE],
        max: [20, `հարկերի քանակը չպետք է մեծ լինի 20 ից`]   
    },
    quantityRooms: {
       type: Number
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
        type: String,
        default: 'Պայմանագրային'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

housSchema.statics.protectedFields = ['_id', '__v', 'createdAt']
housSchema.statics.translatable = ['address', 'description']

export default mongoose.model('Hous', housSchema)
