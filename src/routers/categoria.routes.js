const express = require("express");
const categoriaController = require("../controllers/categorias.controller")
var md_autentication = require("../middlewares/autenticacion");

var api = express.Router();
api.get('/buscarCategoria', md_autentication.Auth, categoriaController.buscarCategoria);
api.post('/agregarCategoria', md_autentication.Auth, categoriaController.agregarCategoria);
api.put('/editarCategoria/:idCategoria', md_autentication.Auth, categoriaController.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', md_autentication.Auth, categoriaController.eliminarCategoria);


module.exports = api;