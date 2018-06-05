import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import env from 'env'
import { Admin } from 'models'

/**
 * token auth
 */
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        ExtractJwt.fromUrlQueryParameter('auth_token')
    ]),
    secretOrKey: env.jwtKey
}, async (payload, done) => {
    const admin = await Admin.findById(payload.id)
    return done(null, admin)
}))

export default passport
