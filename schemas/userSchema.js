const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        default: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    }
})

const User = new mongoose.model("User", userSchema)

module.exports = User;