const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const carritoControlador = require('../controllers/carrito.controller');
const Factura = require('../models/factura.model');




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

function login(req, res){
    var params = req.body;
    Usuario.findOne({usuario: params.usuario},(err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
        if(usuarioEncontrado){
        bcrypt.compare(params.password, usuarioEncontrado.password, (err, passwordCorrecta)=>{
            if(passwordCorrecta){
                if(params.obtenerToken === 'true'){
                    if(usuarioEncontrado.rol ==="ADMIN"){
                        return res.status(200).send({token: jwt.crearToken(usuarioEncontrado)})
                    }else{
                        carritoControlador.crearCarrito(usuarioEncontrado._id);
                        Factura.find({idUsuario: usuarioEncontrado._id}, (err, facturaEncontrada)=>{
                            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                            if(!usuarioEncontrado) return res.status(500).send({mensaje: 'error en la consulta de facturas'})
                            return res.status(200).send({token: jwt.crearToken(usuarioEncontrado),facturaEncontrada})

                        } )                        
                    }
                }else{
                    usuarioEncontrado.password = undefined;

                    return res.status(200).send({usuarioEncontrado})
                }
            }else{
                return res.status(404).send({mensaje: 'el usuario no se ha podido identificar'})
            }
        })
    }else{
        return res.status(404).send({mensaje: 'el usuario no se ha podido encontrar'})
    }
    })

}


function registrarUsuario(req, res){
    var usuarioModel = new Usuario();
    var params = req.body;
    if(params.nombre && params.usuario  && params.password){
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.rol = 'Cliente';
        usuarioModel.password = params.password;
        Usuario.find({$or:[
            {usuario: usuarioModel.Usuario},
            {password: usuarioModel.password}
        ]}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(500).send({mensaje: 'El cliente ya existe'});
            }else{
                bcrypt.hash(params.password, null, null,(err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(usuarioGuardado){
                            res.status(200).send(usuarioGuardado)
                        }else{
                            res.status(404).send({mensaje: 'no se ha podido registrar el usuario'});
                        }
                    })
                })
            }
        })
    }
}


function editarUsuario(req, res) {
    var idUsuario = req.parametros.idUsuario;
    var parametros = req.body;

    if (idUsuario != req.user.sub) {
        return res.status(500).send({ mensaje: 'No pudieres editar usuarios ajenos' })
    }else{
        if (parametros.rol) {
            if (parametros.rol != 'Cliente' && parametros.rol != 'ADMIN'){ 
                return res.status(500).send({ mensaje: 'Rol mal ingresado' })
            }else{
            if(parametros.password) return res.status(500).send({ mensaje: 'La password no puede ser modificada' })
            Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, buscarUsuarioed) =>{

                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!buscarUsuarioed) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
                return res.status(200).send({ buscarUsuarioed });
                })
        }
        }else{
        if(parametros.password) return res.status(500).send({ mensaje: 'La password no puede ser modificada' })
        User.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, buscarUsuarioed) =>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!buscarUsuarioed) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
        return res.status(200).send({ buscarUsuarioed });
        })
    }
}
}

function eliminarUsuario(req, res) {
    var idUsuario = req.parametros.idUsuario;

    if (idUsuario != req.user.sub) {
        return res.status(500).send({ mensaje: 'No puede eliminar a otros usuarios' })
    }else{
        User.findByIdAndDelete(idUsuario, (err, usuarioEliminado) =>{
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
    registrarUsuario,
    editarUsuario,
    eliminarUsuario
}