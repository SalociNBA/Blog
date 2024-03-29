const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Posts")
const Postagens = mongoose.model("posts")
//De dentro do helper é admin a {eAdmin} está pegando apenas a função eAdmin
const {eAdmin} = require("../helpers/eAdmin")

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/categorias", eAdmin, (req, res) => {
    //categoria.find serve para puxar os dados do banco de dados da collection categoria
    //sort() serve para ordenar o resultado
    Categoria.find().sort({date:"desc"}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("Houve um erro ao listar as categorias ")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", eAdmin, (req, res) => {

    var erros = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto: "Nome Inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }

    if(erros.length > 0) {
        res.render("admin/addcategoria", {erros: erros})
    } else {
        const novaCategoria = {
            name: req.body.name,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria Criada com Sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria! tente novamente.")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", eAdmin, (req, res)=>{
    //_id (Campo da Collection) req.body.id (id que está no link)
    //req.params.id é diferente do req.body.id
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render("admin/editCategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

//Processo para salvar a edição de uma categoria existente em uma collection
router.post("/categorias/edit", eAdmin, (req, res)=>{

    //O categoria dentro do then refere-se ao Model
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        //Recebendo na collection os novos valores inseridos nos inputs
        categoria.name = req.body.name
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria Editada com Sucesso!!")
            res.redirect("/admin/categorias")
        }).catch((erro) => { //Catch do categoria.save
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => { //Catch do categorias.findOne
        req.flash("error_mds", "Houve um erro ao Editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/delete", eAdmin, (req, res) =>{
    Categoria.findOneAndDelete({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria Removida com Sucesso!!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria!!")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) => {
    //populate(nome do model que você criou entre "")
    Postagens.find().populate("categoria").sort({date:"desc"}).then((postagens) => {
        res.render("admin/posts", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens" + err)
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {

        res.render("admin/addpostagem", {categorias: categorias})

    }).catch((err) => {
        req.flash("Error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []

    if(req.body.categoria == 0) {
        erros.push({text: "Categoria invalida, selecione uma outra categoria!!"})
    }

    if(erros.length > 0) {
        res.render("admin/addpostagem", {erros: erros})
    } else {
        const novaPostagem = ({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            categoria: req.body.categoria
        })

        new Postagens(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem Criada com sucesso!!!")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

    Postagens.findOne({_id: req.params.id}).then((postagem) => {

        Categoria.find().then((categorias) => {

            res.render("admin/editPostagem", {categorias: categorias, postagem: postagem})

        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", eAdmin, (req, res) => {

    Postagens.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.title,
        postagem.slug = req.body.slug,
        postagem.description = req.body.description,
        postagem.content = req.body.content,
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Falha ao salvar a edição: ")
            res.redirect("/admin/postagens")
        })
        
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })

})

//Segunda forma de se deletar um documento no mongoDB
//Nâo muito recomendado por questões de segurança
router.get("postagens/deletar/:id", eAdmin, (req, res) => {
    Postagens.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        console.log(err)
        req.flash("error_msg", "Falha ao deletar a Postagem")
        res.redirect("/admin/postagens")
    })
})


module.exports = router