require("dotenv").config()
var _ = require('lodash');
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Alien = require("../database/model")
const bcrypt = require("bcrypt")
const { urlencoded } = require("body-parser");
const { findById } = require("../database/model");
var refreshTokens = []


router.delete("/logout", (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== process.env.REFRESH_TOKEN)
        res.sendStatus(204)
    })
    /* 
    router.post("/forget", (req, res) => {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessTokens({ name: user })
            res.json({ accessToken: accessToken })
        })

    }) */

// below method will use to take the refresh token and verify with refresh token of .env then provides the new access token
router.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessTokens({ name: user })
        res.json({ accessToken: accessToken })
    })

})


router.get("/posts", authenticateToken, async(req, res) => {
    console.log(req.user._id)
    await Alien.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
            res.json(err)
        }
        res.json(user)
    })



})

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
console.log(jwt.sign({ _id: "60caf827f92c027c94037616" }, "iebdihgbdigbdigbdgidfdjbj"))

router.post("/superuser/login", (req, res) => {
    userName = req.body.username
    Password = req.body.password
    if (userName == "admin") {
        if (Password == "nimda@123") {
            var listOfAll = ``
            Alien.find().then((user) => {

                for (i of user) {
                    listOfAll += i.name
                    listOfAll += '<br>'
                }

                res.json(`<html>list of user names </br>${listOfAll}</html>`)


            })
        } else {
            res.json("wrong credentials")
        }
    } else {
        res.json("wrong credentials")
    }
})

router.post('/login', (req, res) => {
    Alien.findById(req.body._id)
        .then(async(user) => {
            const valid = await bcrypt.compare(req.body.password, user.password)
            if (valid) {
                const accessToken = generateAccessTokens({ _id: user._id })
                var refreshtoken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN);
                refreshTokens.push(refreshtoken)
                    /* const accessToken = await jwt.sign(user, "shhhhhh"); */
                    //console.log(accessToken)
                    //res.json({ accessToken: accessToken })
                res.json({ accessToken: accessToken, refreshtoken: refreshtoken })
            } else {
                res.send(" wrong credentials")
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
        })

    /*  alien = await Alien.find()
     res.json(alien)
    ; */
})

function generateAccessTokens(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "60s" })
}




//authentication
//body limit 
//route gourding =>authinticate
//reddis
//allowing

//error response
/* router.put('/', async(req, res) => {
    try {
        const resp = await Alien.findByIdAndUpdate(req.body.id, { name: req.body.name })
        res.json(resp)

    } catch (err) {
        console.log(err)
        res.send(err)

    }
})
 */

// when you click on forget password, token is stored in database to the particular user we are trying to reset the password
//here iam not sending access token to mail 
// 
router.put("/forgetpassword", async(req, res) => {

    const email = req.body.email
    const user = await Alien.findOne({ email: email })
    if (!user) {
        res.send("no user with email")
    } else {
        const token = await jwt.sign({ _id: user._id }, process.env.FORGET_PASS, { expiresIn: "10m" });
        return user.updateOne({ forget_password: token }, (err, success) => {
            if (err) {
                return res.json(err)
            }
            res.json(user)
        })



    }
})

//need to reset the password after click on forget password
router.put('/reset', async(req, res) => {
    const resettoken = req.body.token
    const npasword = req.body.password
    jwt.verify(resettoken, process.env.FORGET_PASS, function(error, decodeddata) {
        if (error) {
            return res.status(401).json({
                error: "Incorrect token or token is expired"
            })
        }
        Alien.findOne({ forget_password: resettoken }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "user with this token doesnot exist" })

            }
            const obj = {
                password: npasword
            }
            user = _.extend(user, obj)
            user.save((err, result) => {
                if (err) {
                    return res.status(400).json({ error: "can't save" })
                } else {
                    return res.status(200).json({ message: "password is saved" })
                }
            })
        })
    })


})

router.post("/register", (req, res) => {
    const name = req.body.name
    const age = req.body.age
    const email = req.body.email
    const password = req.body.password
    alien = new Alien({
        name: name,
        age: age,
        email: email,
        password: password
    })


    alien.save()
    res.json(alien)

})

module.exports = router