require("dotenv").config()
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Alien = require("../database/model")
const bcrypt = require("bcrypt")
const { response } = require("express")
const { findByIdAndUpdate } = require("../database/model")

router.get('/', async(req, res) => {

    if (req.query.id) {
        const id = req.query.id
        Alien.findById(id)
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
    } else {
        Alien.find()
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })

    }

})
router.post('/', async(req, res) => {
    const alien = new Alien({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password

    })
    try {
        s
        const a1 = await alien.save()
        res.json(a1)
    } catch (err) {
        res.send(err)
    }

})
router.get("/posts", authenticateToken, (req, res) => {
    console.log(req.user)
    res.send(req.user)


})
router.post('/login', (req, res) => {
    Alien.findById(req.body._id)
        .then(async(user) => {
            const valid = await bcrypt.compare(req.body.password, user.password)
            if (valid) {

                var token = jwt.sign({ userdetails: user }, process.env.ACCESS_TOKEN, { expiresIn: 60 * 2 });
                /* const accessToken = await jwt.sign(user, "shhhhhh"); */
                //console.log(accessToken)
                //res.json({ accessToken: accessToken })
                res.json({ token: token })
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}




//authentication
//body limit 
//route gourding =>authinticate
//reddis
//allowing

//error response
router.put('/', async(req, res) => {
    try {

        const resp = await Alien.findByIdAndUpdate(req.body._id, { name: req.body.name })
        res.json(resp)

    } catch (err) {
        console.log(err)
        res.send(err)

    }
})



module.exports = router