const express=require('express')
const cors=require('cors')
const session = require('express-session')
const api = require("./routes/partner")
const connectDB = require('./config/db')
connectDB()

const app=express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(express.json())


app.use(
  session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {},
  })
)


app.get("/",(req,res) => {
  res.status(200).send("Server up and running")
})

app.use("/api",api)



app.listen(process.env.PORT, () =>
  console.log(`SERVER UP and running at ${process.env.PORT}`))
