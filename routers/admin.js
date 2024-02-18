const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const flash = require("connect-flash")

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req,res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req, res) => {
    //categoria.find serve para puxar os dados do banco de dados da collection categoria
    //sort() serve para ordenar o resultado
    Categoria.find().sort({date:"desc"}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("Houve um erro ao listar as categorias ")
        res.redirect("/admin")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", (req, res) => {

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

router.get("/categorias/edit/:id", (req, res)=>{
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
router.post("/categorias/edit", (req, res)=>{
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


module.exports = router