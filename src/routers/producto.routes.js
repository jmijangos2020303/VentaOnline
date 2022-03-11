const express = require("express");
var md_autentication = require("../middlewares/autenticacion");
const productoController = require("../controllers/productos.controller")

const api = express.Router();
api.post('/registroProducto', productoController.registroProducto);
api.put('/editarProducto/:idProducto',md_autentication.Auth, productoController.editarProducto);
api.delete('/elimininarProducto/:idProducto',md_autentication.Auth, productoController.elimininarProducto);
api.get('/obtenerProductoID/:idProducto',md_autentication.Auth, productoController.obtenerProductoID);
api.get("/buscarProductosPorNombre", md_autentication.Auth, productoController.BusquedaPorNombre);
api.get("/productosPorCategoria", md_autentication.Auth, productoController.productosPorCategoria);
api.get('/controlStock/:idProducto',md_autentication.Auth, productoController.controlStock);
api.get('/productosAgotados',md_autentication.Auth, productoController.productosAgotados);
api.get('/masVendidos',md_autentication.Auth,productoController.masVendidos)

module.exports = api;