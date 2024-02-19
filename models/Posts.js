const mongoose = require("mongoose")
const Schema = mongoose.Schema

const post = new Schema ({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    categoria: {
        //diz que esse dado da collection vai armazenar um ID de algum objeto
        type: Schema.Types.ObjectId,
        //puxa-se pelo nome da collection colocado no model
        ref: "categorias",
        require: true
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

//"nome da collection", qual model vai utilizar 
mongoose.model("posts", post)