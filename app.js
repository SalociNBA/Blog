//Módulos
const express = require("express")
const handlebars = require ("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")

const app = express()

//Configurações
    //body-parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //mongoose

    //Public
    app.use(express.static(path.join(__dirname, "public")))
//Rotas
    const admin = require("./routers/admin")
    app.use("/admin", admin)

//Outros
app.listen(8081, ()=>{
    console.log("Servidor Rodando com Sucesso!!")
})