//Módulos
const express = require("express")
const handlebars = require ("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()

//Configurações
    //Session
        app.use(session({
            secret: "CursoDeNode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        })
    //body-parser
        //body-parser serve para transformar textos JSON em textos JS pelo req.body
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }))
        //
        app.set('view engine', 'handlebars')
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/Blog").then(()=>{
            console.log("Conectado Com Sucesso Ao Servidor MongoDB")
        }).catch((err) => {
            console.log("Falha ao Conectar ao MongoDB: ")
        })
    //Public
    app.use(express.static(path.join(__dirname, "public")))
//Rotas

    app.get("/", (req, res) => {
        res.render("index")
    })

    const admin = require("./routers/admin")
    app.use("/admin", admin)


//Outros
app.listen(8081, ()=>{
    console.log("Servidor Rodando com Sucesso!!")
})