import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const garageSchema = new Schema({
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
    typeGarage: {
        type: String  
    },
    areaGarage: {
        type: Number
    },
    price: {
        type: String,
        default: 'Պայմանագրային'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

garageSchema.statics.protectedFields = ['_id', '__v', 'createdAt']
garageSchema.statics.translatable = ['address', 'description']

export default mongoose.model('Garage', garageSchema)
