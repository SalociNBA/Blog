//Verificar quando estiver rodando no heroku ou no computador local

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://Admin:Admin123@blogapp.mcm2nhh.mongodb.net/?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/Blogapp"}
}