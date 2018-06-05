import express from 'express'
import mongoose from 'mongoose'

/**
 * LOCAL MODULES
 */
import env from 'env'
import passport from 'modules/passport'

/**
 * ROUTES
 */
import apiRoutes from 'routes/api'
import authRoutes from 'routes/auth'

const PORT = process.env.PORT || env.port
const app = express()

mongoose.connect(env.mongodb.url)

app.use('/storage', express.static('storage'))
app.use(require('morgan')('dev'))
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(require('cors')())

app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

app.listen(PORT, () => { console.log(`Server is listening on http://localhost:${PORT}`) })
