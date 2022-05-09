// Server and DB[mongoDB]
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// Dotenv
console.log(`======= ${process.env.NODE_ENV} mode =======`)
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()

  const morgan = require('morgan')
  app.use(morgan('dev'))
}
app.set('view engine', 'pug')
app.use(express.static('public'))

// Import routes
const router = require('./src/routes/index')

// Cors and Middlewares
const cors = require('cors') // Cross-Origin Resource Sharing 
const fileUploader = require('express-fileupload') // [to get data from [FormData]]

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
// const MongoDBStore = require('connect-mongodb-session')(session)

app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: false,
    },
    // store: new MongoDBStore({
    //   uri: process.env.DATABASE_SESSION,
    //   collection: 'motakaSessions'
    // }),
    resave: false,
    saveUninitialized: true,
  })
)

// Use Routes
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
