// Server and DB[mongoDB]
const express = require('express')
const mongoose = require('mongoose')
const app = express()

console.log(`======= ${process.env.NODE_ENV} mode =======`)
if (process.env.NODE_ENV === 'development') {
  // dotenv
  require('dotenv').config()

  const morgan = require('morgan')
  app.use(morgan('dev'))
}
app.set('view engine', 'pug')
app.use(express.static('public'))

// Import routes
const router = require('./src/routes/index')

// Middlewares
const cors = require('cors') // Cross-Origin Resource Sharing ??
// Use fileUploader [to get data from [FormData]]
const fileUploader = require('express-fileupload')

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
)
app.use(fileUploader())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session and Cookie
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoDBStore = require('connect-mongodb-session')(session)

app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: false,
      // After 12 hours the user will log out of the site automatically. //
      // expires: 12 * 60 * 60 * 1000
    },
    // store: new MongoDBStore({
    //   uri: process.env.DATABASE_SESSION,
    //   collection: 'motakaSessions'
    // }),
    resave: false,
    saveUninitialized: true,
  })
)

// Passport
const passport = require('passport')
require('./src/utils/passportFacebook') // Facebook
require('./src/utils/passportGoogle') // Google

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', router)

// Connections
async function connections() {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log('Connection to mongoDB success.')

    const port = process.env.PORT || 7007
    app.listen(port, () => console.log(`Server started on port: ${port}!`))
  } catch (e) {
    console.log('Error in time connections!')
    console.log(e.message)
  }
}

connections()
