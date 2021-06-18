const express = require("express")
const mongoose = require("mongoose")
const layout = require("ejs-layouts")
const bodyparser = require("body-parser")

const connectDB = require('./database/connection');

const app = express()
connectDB();
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: true }))
    //using a perticular router
const alienRouter = require('./routes/alienauth')
app.use("/aliens", alienRouter)
app.set("view engine", "ejs")
app.set("views", 'views')

app.listen(3000, () => {
    console.log("connected port 3000")
})