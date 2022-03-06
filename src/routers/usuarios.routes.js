// IMPORTACIONES
const express = require('express');
const usuariosControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');


//RUTAS 
const api = express.Router();

api.get('/buscarUsuario', usuariosControlador.obtenerUsuarios);
api.post('/login', usuariosControlador.login);
api.post('/createUser', md_autenticacion.Auth, usuariosControlador.agregarUsuario);
api.put('/editUser/:idUser', md_autenticacion.Auth, usuariosControlador.editarUsuario);
api.delete('/deleteUser/:idUser', md_autenticacion.Auth, usuariosControlador.eliminarUsuario);



module.exports = api;