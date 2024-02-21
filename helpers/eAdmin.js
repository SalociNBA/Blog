module.exports = {
    eAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.accountType == 1){
            return next()
        }

        req.flash("error_msg", "Você deve ser um administrador para acessar esta pagina")
        res.redirect("/")

    }
}