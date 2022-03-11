// IMPORTACIONES
const express = require('express');
const usuariosControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');


//RUTAS 
const api = express.Router();

api.get('/buscarUsuario', usuariosControlador.obtenerUsuarios);
api.post('/login', usuariosControlador.login);
api.post('/registrarUsuario', usuariosControlador.registrarUsuario);
api.put('/editarUsuario/:idUsuario', md_autenticacion.Auth, usuariosControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuariosControlador.eliminarUsuario);



module.exports = api;