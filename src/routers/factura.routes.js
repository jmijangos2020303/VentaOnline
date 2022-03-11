const express = require("express");
const facturaController = require("../controllers/facturas.controller");
var md_autentication = require("../middlewares/autenticacion");

var api = express.Router();
api.get('/crearFactura/:idUsuario', md_autentication.Auth, facturaController.crearFactura);
api.get('/obtenerFacturas',md_autentication.Auth,facturaController.obtenerFacturas);
api.get('/obtenerFacturaId/:idFactura',md_autentication.Auth,facturaController.obtenerFacturaId);
api.get('/facturaPdf', md_autentication.Auth, facturaController.crearPDF);


module.exports = api;