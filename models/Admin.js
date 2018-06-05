import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'

const adminSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Էլ. փոստի դաշտը պարտադիր է:'],
        unique: true,
        validate: {
            validator: (value) => {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
            },
            message: '{VALUE} - Ճիշտ էլ. փոստի հասցե չէ:'
        }
    },
    password: { 
        type: String, 
        required: [true, 'Գաղտնաբառ դաշտը պարտադիր է:'],
        minlength: [6, 'Գաղտնաբառի սինվոլների քանակը, պետք է լինի առնվազն 6 սինվոլ:']
    },
    admin: Boolean,
    registeredAt: { 
        type: Date,
        default: Date.now 
    }
})

adminSchema.post('validate', (doc, next) => {
    doc.password = bcrypt.hashSync(doc.password, 10)

    return next()
})

adminSchema.statics.protectedFields = ['_id', '__v', 'admin', 'registeredAt']

adminSchema.statics.seed = async function () {
    try {
        const admin = await this.find()

        if (!admin.length) {
            let admin = new this({
                email: 'realtyhv@gmail.com',
                password: '055322272hayk',
                admin: true
            })

            await admin.save()
        }
    } catch (e) {
        console.log(e)
    }
}

const Admin = mongoose.model('Admin', adminSchema)

Admin.seed()

export default Admin
