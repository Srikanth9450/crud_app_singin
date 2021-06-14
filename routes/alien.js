const express = require("express")
const router = express.Router()
const Alien = require("../database/model")
const bcrypt = require("bcrypt")

router.get('/', async(req, res) => {

    if (req.query.name) {
        const id = req.query.name
        Alien.find({ name: id })
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
        const a1 = await alien.save()
        res.json(a1)
    } catch (err) {
        res.send(err)
    }

})
router.post('/login', async(req, res) => {
    const user = req.body.name;
    const password = req.body.password
    console.log(`${user} : ${password}`)
    Alien.findOne({ name: req.body.name })
        .then(users => {
            console.log(users)
            password2 = users.password
            console.log(req.body.name + " " + users.password);
            bcrypt.compare(req.body.name, users.password).then(function(result) {
                res.send("logged in ")
            }).catch(err => {
                res.send("password wrong")
            })
        })
        .catch(err => {
            res.send("no user with name" + err)
        })
})
module.exports = router