const Categoria = require("../models/categoria.model");
const Producto = require("../models/producto.model");
const Usuario = require("../models/usuarios.model");

function mainStart(req, res) {

    let categoriaModelo = new Categoria();

    categoriaModelo.nombreCategoria = 'Por defecto'
    categoriaModelo.descripcion = 'Categoria nula o por defecto'

    Categoria.find({$or:[
        {nombreCategoria: categoriaModelo.nombreCategoria}
    ]}).exec((err, buscarCategoria) =>{
        if(err) return console.log("ERROR en la peticion")
        
        if(buscarCategoria && buscarCategoria.length>=1){
            console.log("Categoria por defecto ya existente")
        }else{
            categoriaModelo.save((err,saveCategory)=>{
                if(err) return console.log( "ERROR al crear categoria predeterminada" )

                if(saveCategory){
                    console.log( "Categoria predeterminada creada" )
                }
            })
        }
    })
}


function buscarCategoria(req, res) {
    
    Usuario.find({ _id: req.user.sub }, (err, buscarUsuario) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al comparar usuarios' })

        if (buscarUsuario) {
            Categoria.find((err, buscarCategoria) =>{
                    if(err) return res.status(500).send({ mensaje: 'Error al solicitar categorias' })
                    if (buscarCategoria) {
                        return res.status(200).send({ buscarCategoria })
                    }else{
                        return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
                    }
                })
        }else{
            return res.status(500).send({ mensaje: 'Usuario no encontrado' })
        }
    })
}


function agregarCategoria(req, res) {
    var categoriaModelo = new Categoria();
    var params = req.body;

    if (req.user.usuario != 'ADMIN') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede crear nuevos usuarios' })
    }else{
        if( params.nombreCategoria && params.descripcion ){
            categoriaModelo.nombreCategoria = params.nombreCategoria;
            categoriaModelo.descripcion = params.descripcion;

            Categoria.find({ $or: [
                { nombreCategoria: categoriaModelo.nombreCategoria },
                { descripcion: categoriaModelo.descripcion }
            ] }).exec((err, buscarCategoria) =>{
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' });

                if(buscarCategoria && buscarCategoria.length >=1){
                    return res.status(500).send({ mensaje: 'ERROR datos repetidos' })
                }else{
                    categoriaModelo.save((err, guardarCategoria) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR al guardar categoria' })

                        if(guardarCategoria){
                            return res.status(200).send({ mensaje: `Categoria guardada!`, guardarCategoria })
                        }else{
                            return res.status(500).send({ mensaje: 'ERROR no se logro registrar la categoria' })
                        }
                    })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Datos insuficientes' })
        }
    }

}


function editarCategoria(req, res) {
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    if(req.user.usuario != 'ADMIN'){
        return res.status(500).send({ mensaje: 'No puede modificar categorias' });
    }else{
        Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, buscarCategoria) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!buscarCategoria) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });

        return res.status(200).send({ mensaje: `Categoria editada con exito!`, buscarCategoria });
        })
    }
}

function eliminarCategoria(req, res) {
    var idCategoria = req.params.idCategoria;

    Categoria.findById( idCategoria , (err, buscarCategoria) =>{
        if (err)return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (buscarCategoria) {
            Categoria.findOne({ nombreCategoria: 'Por defecto' }, (err, buscarPorDefecto) =>{
                if(err) return res.status(500).send({ mensaje: 'ERROR al encontrar productos' })

                if (!buscarPorDefecto) return res.status(500).send({ mensaje: 'Categoria default inexistente, vuelva a correr el programa' })

                    Producto.updateMany({ categoriaID: idCategoria }, { categoriaID: buscarPorDefecto._id }, (err, productGet) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion' });

                    })
                    Categoria.findByIdAndDelete(idCategoria, (err, categoriaEliminado) =>{
                        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion de usuario' });
                        if(!categoriaEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario' });

                        return res.status(200).send({ mensaje: `Se elimino con exito!`, categoriaEliminado });
                    })
                })
            }else{
                return res.status(500).send({ mensaje: 'Categoria no encontrada' })
        }
    })
}

module.exports = {
    mainStart,
    buscarCategoria,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria
}