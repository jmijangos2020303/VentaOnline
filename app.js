const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS

const rutaUsuario = require("./src/routers/usuarios.routes");
const rutaCategoria = require("./src/routers/categoria.routes");
const rutaProducto = require("./src/routers/producto.routes");
const rutaCarrito = require("./src/routers/carrito.routes")
const rutaFactura = require("./src/routers/factura.routes");




// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());


// CARGA DE RUTAS localhost:3000/api/usuarios, empresas etc
app.use('/api', rutaUsuario, rutaCategoria, rutaProducto, rutaFactura, rutaCarrito);

module.exports = app;