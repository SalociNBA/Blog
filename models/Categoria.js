const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const categoria = new Schema ({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

//"nome da collection", qual model vai utilizar 
//primeiro nome é para poder puxar nos outros files
mongoose.model("categorias", categoria)
