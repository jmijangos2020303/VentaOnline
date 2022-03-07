const Producto = require("../models/producto.model");
const Categoria = require("../models/categoria.model");
const Usuario = require("../models/usuarios.model");
const Carrito = require("../models/carrito.model");

function buscarProductos(req, res) {

    Usuario.find({ _id: req.user.sub }, (err, buscarUsuario) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar usuario' })

        if (buscarUsuario) {
            Producto.find((err, buscarProductos) =>{
            if(err) return res.status(500).send({ mensaje: 'Error al solicitar productos' })
            if (buscarProductos) {
                return res.status(200).send({ buscarProductos })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
        }
    })
}



function agregarProducto(req, res) {
    var idCategoria = req.params.idCategoria;
    var modeloProductos = new Producto();
    var parametros = req.body;

    if (req.user.usuario != 'ADMIN') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Categoria.find({ _id: idCategoria }, (err, buscarCategoria) =>{
        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (buscarCategoria) {
            if (parametros.nombre && parametros.precio && parametros.stock) {
                modeloProductos.nombre = parametros.nombre;
                modeloProductos.precio = parametros.precio;
                modeloProductos.stock = parametros.stock;
                modeloProductos.categoriaID = idCategoria;
                modeloProductos.vendidos = 0;

                Producto.find({ nombre: modeloProductos.nombre }).exec(( err, buscarProducto ) =>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' });

                    if (buscarProducto && buscarProducto.length >= 1 ) {
                        return res.status(500).send({ mensaje: 'Ya existe un producto con este nombre' })
                    }else{
                        modeloProductos.save(( err, productSave ) =>{
                            if(err) return res.status(500).send({ mensaje: 'ERROR al registrar el producto' })

                            if (productSave) {
                                res.status(200).send({ mesnaje: 'Producto guardado con exito!', productSave })
                            }else{
                                res.status(500).send({ mensaje: 'No se logro registrar el producto' })
                            }
                        })
                    }
                })
            }else{
                return res.status(500).send({ mensaje: 'ERROR parametro sin llenar' })
            }
        }else{
            return res.status(500).send({ mensaje: 'No se ha encontrado una cotegoria con el ID enviado' })
        }
    })
    }
}



function editarProducto(req, res) {
    var parametros = req.body;
    var idProducto = req.params.idProducto;

    if (req.user.usuario != 'ADMIN') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Producto.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, buscarProducto) =>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!buscarProducto) return res.status(500).send({ mensaje: 'Error al actualizar Producto' });
        return res.status(200).send({ buscarProducto });
        })
    }    
}




function eliminarProducto(req, res) {
    var idProducto = req.params.idProducto;

    if (req.user.usuario != 'ADMIN') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Producto.findById( idProducto , (err, buscarProducto) =>{
            if (err)return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

            if (buscarProducto) {
                    Carrito.deleteMany({ productoID: idProducto }, (err, carritoEncontrado) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion' });

                    })
                    Producto.findByIdAndDelete(idProducto, (err, productoEliminado) =>{
                        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion del producto' });
                        if(!productoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar producto' });

                        return res.status(200).send({ mensaje: `Se elimino con exito!`, productoEliminado });
                    })
            }else{
                return res.status(500).send({ mensaje: 'Categoria no encontrada' })
            }
        })
    }
} 



function obtenerProductoPorCategoría(req, res) {
    var idCategoria = req.params.idCategoria;

    Usuario.find({ _id: req.user.sub }, (err, buscarUsuario) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al verificar usuario' })

        if (buscarUsuario) {

            Producto.find({ categoriaID: idCategoria }, (err, categoriaEncontrada) =>{
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar productos' })

            if (categoriaEncontrada) {
                return res.status(200).send({ categoriaEncontrada })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron coincidencias' })
            }

        })

        }else{
            return res.status(500).send({ mensaje: 'No se encontraron coincidencias con el usuario' })
        }
    })}



function obtenerProductoPorNombre(req, res) {
    var nombreProducto = req.params.nombreProducto;
    
    Usuario.find({ _id: req.user.sub }, (err, buscarUsuario) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR en la comparacion de usuarios' })
        if (buscarUsuario) {
    
            Producto.find({ nombre: nombreProducto } ,(err, productoEncontrado) =>{
                if (err) return res.status({ mensaje: 'ERROR al obtner nombre de producto' })
                if (productoEncontrado) {
                        return res.status(200).send({ productoEncontrado })
                }else{
                    return res.status(500).send({ mensaje: 'No se encontraron coincidencias' })
                }
            })
    
        }else{
            return res.status(500).send({ mensaje: 'Usuario no encontrado en la DB' })
        }
    })
}


module.exports = {
    buscarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerProductoPorCategoría,
    obtenerProductoPorNombre
}