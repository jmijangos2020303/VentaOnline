const Productos = require("../models/producto.model");
const Categoria = require("../models/categoria.model");
const categoriaModel = require("../models/categoria.model");


function registroProducto(req, res){
    var productosModel = new Productos();
    var parametros = req.body;
    if(parametros.nombre && parametros.descripcion && parametros.precio && parametros.stock  && parametros.idCategoria){
        productosModel.nombre = parametros.nombre,
        productosModel.descripcion = parametros.descripcion;
        productosModel.precio = parametros.precio;
        productosModel.stock = parametros.stock;
        productosModel.categoriaID = parametros.idCategoria;
        Productos.find({$or:[
            {nombre: productosModel.nombre},
            {descripcion: productosModel.descripcion}
        ]}).exec((err, productoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
            if(productoEncontrado && productoEncontrado >=1){
                return res.status(500).send({mensaje: 'el producto ya existe'})
            }else{
                productosModel.save((err, productoGuardado)=>{
                    if(productoGuardado){
                        res.status(200).send({productoGuardado})
                    }else{
                        res.status(404).send({mensaje: 'no se a podido ingresar el producto'});
                    }
                })
            }
        })
    }
}

function editarProducto(req, res){
    var idProducto = req.params.idProducto;
    var parametros = req.body;
    if(req.user.usuario === 'ADMIN'){
        Productos.findByIdAndUpdate(idProducto, parametros, {new: true, useFindAndModify: false},(err, productoActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
        if(!productoActualizado) return res.status(500).send({mensaje: 'no se ha podido encontrar el producto'})
        return res.status(200).send({productoActualizado});
        })
    }else{
        return res.status(500).send({mensaje: 'no tienes los permisos necesarios'})
    }
}

function elimininarProducto(req, res){
    var idProducto = req.params.idProducto;
if(req.user.usuario === 'ADMIN'){
Productos.findByIdAndDelete(idProducto,(err, productoEliminado)=>{
    if(err) return res.status(500).send({mensaje: 'error en la peticion'})
    if(!productoEliminado) return res.status(500).send({mensaje: 'producto no encontrado'})
    return res.status(200).send({mensaje: 'el producto eliminado es: ', productoEliminado})
})
}else{
    return res.status(500).send({mensaje: 'no tienes los permisos necesarios'})
}
}

// obtener por medio de: cantidad de mas vendidos, stock
function obtenerProductoID(req, res){
var idProducto = req.parametros.idProducto;
Productos.findById(idProducto, (err, productoEncontrado)=>{
    if(err) return res.status(500).send({mensaje: 'error en la peticion'});
    if(!productoEncontrado) return res.status(500).send({mensaje: 'producto no encontrado'})
    return res.status(200).send({productoEncontrado})

})
}


function BusquedaPorNombre(req, res) {
    var parametros = req.body;

    Productos.find({ nombre: { $regex: parametros.nombre, $options: "i" } }, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!productoEncontrado) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ producto: productoEncontrado })
    })
}


function productosPorCategoria(req,res){
    var params = req.body;
    Categoria.findOne({nombreCategoria:{$regex:params.nombreCategoria, $options: 'i'}}, (err, categoryFound)=>{

        if(err) return res.status(404).send({mesanje: 'Categoria no encontrada =('})

        if(!categoryFound) return res.status(404).send({report:'La categoria no Existe Sorry'})

        Productos.find({categoriaID: categoryFound._id},(err,productFound)=>{

            if(err) return res.status(404).send({report: 'Error fidn products'})
            
            if(productFound && productFound.length == 0) return res.status(402).send({report: 'There are no products'})

            return res.status(200).send(productFound);
        })

    })
    
}



function controlStock(req, res){
    var idProducto = req.params.idProducto;   
    Productos.findById(idProducto, (err, productoEncontrado)=>{
        if(productoEncontrado.stock != 0){
            return res.status(200).send({mensaje: 'producto disponible'})

        }else{
            return res.status(500).send({mensaje: 'producto agotado' })
        }
    })
}

function productosAgotados(req, res){
    if(req.user.usuario ==='ADMIN'){
        Productos.find({stock: 0},(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la solicitud'})
        if(!productoEncontrado) return res.status(500).send({mensaje: 'productos no encontrados'})
        return res.status(500).send({mensaje: 'producto agotado', productoEncontrado})
        })
    }else{
        return res.status(500).send({mensaje: 'no posee los permisos necesarios'})
    }
}

function masVendidos(req,res){
    Productos.aggregate([
        {$project:{_id: 1, nombre: 1, precio: 1,cantidadVendida: 1}},
        {$sort: {cantidadVendida: -1}}
    ]) .exec((err, productoEncontrado)=>{
        return res.status(200).send({productoEncontrado})
    })
}
    

module.exports = {
    registroProducto,
    editarProducto,
    elimininarProducto,
    obtenerProductoID,
    BusquedaPorNombre,
    controlStock,
    productosAgotados,
    masVendidos,
    productosPorCategoria
}