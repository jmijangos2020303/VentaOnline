const express = require("express");
const carritoController = require("../controllers/carrito.controller")
var md_autentication = require("../middlewares/autenticacion");

var api = express.Router();
api.post('/agregarProductoACarrito', md_autentication.Auth, carritoController.agregarCarrito);

module.exports = api;