import multer from 'multer'
import crypto from 'crypto'
import mime from 'mime'
import path from 'path'
import fs from 'fs'

import env from 'env'

export default function (destination) {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                let dest = path.join(env.storage, destination)
                if (!fs.existsSync(dest))
                    fs.mkdirSync(dest)
                
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                crypto.pseudoRandomBytes(16, (err, raw) => {
                    if (err)
                        cb(null, err)
                    cb(null, `${raw.toString('hex')}${Date.now()}.${mime.getExtension(file.mimetype)}`)
                })
            }
        })
    })
}
