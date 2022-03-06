const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { findById } = require("../models/usuarios.model");
const Empleados = require('../models/empleados.model');
const usuariosModel = require('../models/usuarios.model');
const empleadosModel = require('../models/empleados.model');




exports.verAdmin = function(req, res, next) {
    if(req.user.rol !== "ADMIN") return res.status(403).send({mensaje: "Esta accion solo esta permitida por el Administrador"})
    
    next();
}

exports.verEmpresa = function(req, res, next) {
    if(req.user.rol !== "EMPRESA") return res.status(403).send({mensaje: "Esta accion solo esta permitida por la Empresa"})
    
    next();
}




