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
    res.render("admin/categorias")
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
            req.flash("success_msg", "Categoria Criada com Sucesso!");
            res.redirect("/admin/categorias");
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria! tente novamente.");
            res.redirect("/admin")
        })
    }
})


module.exports = router