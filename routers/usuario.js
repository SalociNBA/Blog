const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email invalido"})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({texto: "Senha invalida"})
    }

    if(req.body.password != req.body.confirm_password) {
        erros.push({texto: "As senhas não coincidem, digite novamente"})
    }

    if (erros.length > 0) {

        res.render("usuarios/registro", {erros: erros})

    } else {

        Usuario.findOne({email: req.body.email}).then((user) => {
            if(user){
                req.flash("error_msg", "Email já cadastrado!")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario ({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
                        if(erro) {
                            console.log(erro)
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }

                        novoUsuario.password = hash

                        novoUsuario.save().then(()=> {
                            req.flash("success_msg", "Usuario criado com sucesso")
                            res.redirect("/")
                        }).catch((err) => {
                            console.log(err)
                            req.flash("error_msg", "Houve um erro ao criar o usuário")
                            res.redirect("/usuarios/registro")
                        })


                    })
                })

            }
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })

    }

})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)

})

router.get("/logout", (req, res) => {

    req.logout()
    req.flash("success_msg", "Deslogado com Sucesso")
    res.redirect("/")

})


module.exports = router