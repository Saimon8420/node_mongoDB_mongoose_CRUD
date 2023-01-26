require("dotenv").config();
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../schemas/userSchema');
const router = express.Router();
const saltRounds = 10;

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPass,
        });
        await newUser.save();
        if (!newUser) {
            return res.status(404).json({ message: "User info not found" });
        }
        res.status(200).json({ message: "Signup was successful", newUser });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
})

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });
        if (user && user.length > 0) {
            const passValidation = await bcrypt.compare(req.body.password, user[0].password);

            if (passValidation) {
                // generate web token
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1hr'
                });
                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful!"
                });
            }
            else {
                res.status(401).json({
                    "error": "Authentication failed!"
                })
            }
        }
        else {
            res.status(401).json({
                "error": "Authentication failed!"
            })
        }
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;