const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    accountType: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
})

//collection usuarios é definido pelo Schema Usuario
mongoose.model("usuarios", Usuario)