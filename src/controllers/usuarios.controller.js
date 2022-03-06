const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function mainStart(req, res) {

    let usuarioModelo = new Usuario();

    usuarioModelo.usuario = 'ADMIN'
    usuarioModelo.password = '123456'

    Usuario.find({$or:[
        {usuario: usuarioModelo.usuario}
    ]}).exec((err, buscarUsuario)=>{
        if(err) return console.log("ERROR en la peticion")
        
        if(buscarUsuario && buscarUsuario.length>=1){
            console.log("Usuario Admin creado con anterioridad")
        }else{
            bcrypt.hash(usuarioModelo.password,null,null, (err, passCrypt)=>{
                usuarioModelo.password = passCrypt;
            })

            usuarioModelo.save((err,usuarioGuardado)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(usuarioGuardado){
                    console.log( "Usuario Admin Creado" )
                }
            })
        }
    })
}

function obtenerUsuarios(req, res) {
    Usuario.find((err, usuarioEncontrado) =>{
        if(err) return res.status(500).send({ mensaje: 'Error al solicitar usuarios' })
        if (usuarioEncontrado) {
            return res.status(200).send({ usuarioEncontrado })
        }else{
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function login(req, res) {
    var parametros = req.body

    Usuario.findOne({ usuario: parametros.usuario }, (err, buscarUsuario) =>{
        if(err) {return res.status(500).send({ mensaje: 'Error al solicitar datos' })
        }else if(buscarUsuario) {
            bcrypt.compare(parametros.password, buscarUsuario.password, (err, correctPass)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error al comparar'});
                }else if(correctPass){
                    return res.status(200).send({token: jwt.crearToken(buscarUsuario)});
                }else{
                    res.send({mensaje: 'Contraseña incorrecta'});
                }
            });
        }else{
            res.send({ mensaje: 'Datos de usuario incorrectos' });
        }
    })
}

function agregarUsuario(req, res) {
    var usuarioModelo = new Usuario();
    var parametros = req.body;
    
    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede crear nuevos usuarios' })
    }else{
        if(parametros.usuario && parametros.password && parametros.nombre) {
            usuarioModelo.nombre = parametros.nombre;
            usuarioModelo.usuario = parametros.usuario;
            usuarioModelo.rol = 'Cliente';

            Usuario.find({ usuario: usuarioModelo.usuario }).exec((err, buscarUsuario) =>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' })

                if(buscarUsuario && buscarUsuario.length >= 1) {
                    return res.status(500).send({ mensaje: 'Ya existe este Usuario' })
                }else{
                    bcrypt.hash(parametros.password, null, null, (err, passCrypt) =>{
                        usuarioModelo.password = passCrypt;

                        usuarioModelo.save((err, usuarioGuardado) =>{
                            if(err) return res.status(500).send({ mensaje: 'ERROR al guardar la empresa' })

                            if(usuarioGuardado) {
                                res.status(200).send({ usuarioGuardado })
                            }else{
                                res.status(500).send({ mensaje: 'No se pudo registrar una nueva Empresa' })
                            }
                        })
                    })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Necesitas los campos siguientes: usuario, password y nombre' })
        }
    }

}

function editarUsuario(req, res) {
    var idUser = req.parametros.idUser;
    var parametros = req.body;

    if (idUser != req.user.sub) {
        return res.status(500).send({ mensaje: 'No pudieres editar usuarios ajenos' })
    }else{
        if (parametros.rol) {
            if (parametros.rol != 'Cliente' && parametros.rol != 'ADMIN'){ 
                return res.status(500).send({ mensaje: 'Rol mal ingresado' })
            }else{
            if(parametros.password) return res.status(500).send({ mensaje: 'La contraseña no puede ser modificada' })
            Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, buscarUsuarioed) =>{

                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!buscarUsuarioed) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
                return res.status(200).send({ buscarUsuarioed });
                })
        }
        }else{
        if(parametros.password) return res.status(500).send({ mensaje: 'La contraseña no puede ser modificada' })
        User.findByIdAndUpdate(idUser, parametros, { new: true }, (err, buscarUsuarioed) =>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!buscarUsuarioed) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
        return res.status(200).send({ buscarUsuarioed });
        })
    }
}
}

function eliminarUsuario(req, res) {
    var idUser = req.parametros.idUser;

    if (idUser != req.user.sub) {
        return res.status(500).send({ mensaje: 'No puede eliminar a otros usuarios' })
    }else{
        User.findByIdAndDelete(idUser, (err, usuarioEliminado) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion de usuario' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario' });

        return res.status(200).send({ mensaje: `Se elimino a ${req.user.usuario} con exito!` });
    })
    }
}

module.exports = {
    mainStart,
    obtenerUsuarios,
    login,
    agregarUsuario,
    editarUsuario,
    eliminarUsuario
}