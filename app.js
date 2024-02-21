//Módulos
const express = require("express")
const handlebars = require ("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Posts")
const Postagem = mongoose.model("posts")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routers/usuario")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")

const app = express()

//Configurações
    //Session
        app.use(session({
            secret: "CursoDeNode",
            resave: true,
            saveUninitialized: true
        }))


        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
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
        mongoose.connect(db.mongoURI).then(()=>{
            console.log("Conectado Com Sucesso Ao Servidor MongoDB")
        }).catch((err) => {
            console.log("Falha ao Conectar ao MongoDB: ")
        })
    //Public
    app.use(express.static(path.join(__dirname, "public")))
//Rotas

    app.get("/", (req, res) => {
        Postagem.find().populate("categoria").sort({date: "desc"}).then((post) => {
            //{Nome que deseja colocar para usar no HTML: nome do Model}
            res.render("index", {postagens: post})
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/postagem/:slug", (req, res) => {
        //esse postagem dentro do then recebe o resultado da pesquisa na collection
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
                //Esse postagem se refere ao resultado da pesquisa colocado no then
                res.render("posts/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe!")
                res.redirect("/")
            }
        }).catch((err)=>{
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().then((categorias) => {

            res.render("categorias/index", {categorias: categorias})

        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) =>{
            if(categoria){

                //Busca pelos posts que pertencem a categoria
                Postagem.find({categoria: categoria._id}).then((postagens)=>{

                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch((err) => {
                    console.log(err)
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/")
            }
        }).catch((err)=>{
            console.log(err)
            req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria")
            res.redirect("/")
        })
    })

    app.use("/usuarios", usuarios)

    app.get("/404", (req, res) => {
        res.send("Error 404")
    })

    const admin = require("./routers/admin")
    app.use("/admin", admin)


//Outros
const port = process.env.PORT || 8081;
app.listen(port, ()=>{
    console.log("Servidor Rodando com Sucesso!!")
})