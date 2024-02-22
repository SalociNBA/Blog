const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
//Model de usuário
require("../models/usuario")
const Usuario = mongoose.model("usuarios")



module.exports = (passport)=>{

    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {

        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario) {
                //Dados da conta que foi autenticada, se a autenticação aconteceu com sucesso ou não e a mensagem
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(password, usuario.password, (erro, batem) => {
                if(batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })

    }))

    //Salva os dados do usuário em uma SESSÃO
    passport.serializeUser((user, done) => {

        done(null, user.id)

    })

    passport.deserializeUser((id, done) => {

        Usuario.findById(id).then((user) => {
            done(null, user)
        }).catch((err) => {
            done(err)
        })

    })


}