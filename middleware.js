import { ERROR } from 'enum'

export function admin (req, res, next) {
    if (!req.user.admin) {
        return res.status(ERROR.PERMISSION_DENIED).json({ status: ERROR.PERMISSION_DENIED, message: 'Permission denied!' })
    }

    return next()
}
