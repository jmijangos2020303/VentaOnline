const mongoose = require('mongoose');
const app = require('./app');
const usuarioController = require("./src/controllers/usuarios.controller")
const categoriaController = require("./src/controllers/categorias.controller")



mongoose.Promise = global.Promise;                                                                  //function (){}
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");
    usuarioController.mainStart();
    categoriaController.mainStart();

    app.listen(3000, function () {
        console.log("Hola PROFE, esta corriendo en el puerto 3000!")
    })

}).catch(error => console.log(error));