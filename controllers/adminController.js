import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * local modules
 */
import { ERROR } from 'enum'
import env from 'env'
import { Admin } from 'models'

export async function login (req, res) {
    try {
        const admin = await Admin.findOne({ email: req.body.email })

        if (!admin) {
            return res.status(ERROR.WRONG_CREDENTIALS).json({
                status: ERROR.WRONG_CREDENTIALS,
                message: 'Համապատասխան էլ. փոստ չկա:'
            })
        }

        if (!bcrypt.compareSync(req.body.password, admin.password))
            return res.status(ERROR.WRONG_CREDENTIALS).json({
                status: ERROR.WRONG_CREDENTIALS,
                message: 'Սխալ գաղտնաբառ:'
            })

        let token = jwt.sign({
            id: admin.id
        }, env.jwtKey)
        
        return res.json({ token })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
