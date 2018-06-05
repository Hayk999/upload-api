import mongoose, { Schema } from 'mongoose'
import { ERR_MSG } from 'enum'

const pageSchema = new Schema({
    key: {
        type: String,
        required: [true, ERR_MSG.KEY]
    },
    headTitle: {
        en: {
            type: String,
            default: ''
        },
        am: {
            type: String,
            default: ''
        }
    },
    title: {
        en: {
            type: String,
            default: ''
        },
        am: {
            type: String,
            default: ''
        }
    },
    content: {
        en: {
            type: String,
            default: ''
        },
        am: {
            type: String,
            default: ''
        }
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

pageSchema.statics.protectedFields = ['_id', 'key', 'createdAt']
pageSchema.statics.translatable = ['headTitle', 'title', 'content']

pageSchema.statics.seed = async function () {
    try {
        const page = await this.find()

        let pages = [{key: 'about'}]

        if (!page.length) {
            for (let i = 0; i < pages.length; i++) {
                try {
                    let nextPage = new this({
                        key: pages[i].key
                    })
        
                    await nextPage.save()
                } catch (e) {
                    console.log(e)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

const Page = mongoose.model('Page', pageSchema)

Page.seed()

export default Page
