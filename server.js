// Server and DB[mongoDB]
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// For development 
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const morgan = require('morgan')
app.use(morgan('dev'))


// Import routes
const router = require('./src/routes/index')

// Middlewares
// const cors = require('cors') // Cross-Origin Resource Sharing ??

// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session and Cookie
const session = require('express-session')
const cookieParser = require('cookie-parser')
// const SequelizeStore = require('connect-session-sequelize')(session.Store)
const MongoDBStore = require('connect-mongodb-session')(session)


app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
    /* After 12 hours the user will log out of the site automatically. */
    // expires: 12 * 60 * 60 * 1000
  },
  // store: new SequelizeStore({
  //   db: sequelize,
  //   // Delete cookies from session db `expires` < '2022-04-24 08:30:37'
  //   //                                 `expires` < '2022-04-24 08:50:40'
  //   // checkExpirationInterval: 20 * 1000
  // }),
  store: new MongoDBStore({
    uri: process.env.DATABASE_SESSION,
    collection: 'motakaSessions'
  }),
  resave: false,
  saveUninitialized: true
}))

// Passport 
const passport = require('passport')
require('./src/utils/passportFacebook') // Facebook
require('./src/utils/passportGoogle')  // Google
require('./src/utils/passportLocal')  // Local

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', router)

// Connections 
async function connections() {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL)
    console.log('Connection to mongoDB success.')

    const port = process.env.PORT || 7007
    app.listen(port, () => console.log(`Server started on port: ${port}!`))
  } catch (e) {
    console.log('Error in time connections!')
    console.log(e.message)
  }
}

connections()
