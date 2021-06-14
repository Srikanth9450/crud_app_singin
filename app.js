const express = require("express")
const mongoose = require("mongoose")


const connectDB = require('./database/connection');

const app = express()
connectDB();
app.use(express.json())
    //using a perticular router
const alienRouter = require('./routes/alien')
app.use("/aliens", alienRouter)
app.listen(3000, () => {
    console.log("connected port 3000")
})