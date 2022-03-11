const Producto = require("../models/producto.model");
const Factura = require("../models/factura.model");
const pdf = require("html-pdf");
const FacturaControlador = require('./facturas.controller');
const carritoModel = require("../models/carrito.model");
const Carrito = require("../models/carrito.model")
const carritoControlador = require('./carrito.controller')



function crearFactura(req, res){
    var facturaModel = new Factura();
    var idUsuario = req.params.idUsuario;
       Carrito.findOne({idUsuario: idUsuario}, (err, carritoEncontrado)=>{
           if(err) return res.status(500).send({mensaje: 'error en la peticion0'});
           if(!carritoEncontrado) return res.status(500).send({mensaje: 'carrito no encontrado'})
               facturaModel.idUsuario = carritoEncontrado.idUsuario;
               facturaModel.productos = carritoEncontrado.productos;
               facturaModel.total = carritoEncontrado.total;
               for(let i = 0; i < facturaModel.productos.length; i++) {
                var propiedad = facturaModel.productos[i].idProducto;
                var cant = facturaModel.productos[i].stock;
                Producto.findByIdAndUpdate(propiedad, {$inc: {cantidadVendida: +1}},{new: true, useFindAndModify: false},(err, productoEncontrado)=>{
                    if(err) return res.status(500).send({mensaje: 'error en la peticion1'})
                    if(!productoEncontrado)return res.status(500).send({mensaje: 'no se ha encontrado el producto'});
                       /*Producto.findByIdAndUpdate(propiedad,{stock: productoEncontrado.stock-cant},{new: true, useFindAndModify: false},(err, productoEncontrado2)=>{
                       if(err) return res.status(500).send({mensaje: 'error en la peticion2'})
                       if(!productoEncontrado2) return res.status(500).send({mensaje: 'no se ha encontrado el producto'});
                       })*/
                })
               }
               Carrito.findOneAndDelete( {idUsuario: idUsuario}, (err, carritoEliminado)=>{
                   if(err) return res.status(500).send({mensaje: 'error en la petion al eliminar el carrito'})
                   if(!carritoEliminado) return res.status(500).send({mensaje: 'error al econtrar el carrito'})
               })                    
               carritoControlador.crearCarrito(idUsuario);
               facturaModel.save((err, facturaGuardada)=>{
                   if(err) return res.status(500).send({mensaje: 'Error al guardar el carrito'} )
                    if(!facturaGuardada){
                       return res.status(500).send({mensaje: 'No se ha podido registrar el carrito'})
                    }else{
                        return res.status(200).send({facturaGuardada});
                    }
                })     
       })
   }

   
   function obtenerFacturas (req, res){
       if(req.usuario.rol ==='ADMIN'){
       Factura.find((err, facturaEncontrada)=>{
           if(err) return res.status(500).send({mensaje: 'error en la peticion'})
           if(!facturaEncontrada) return res.status(500).send({mensaje: 'error en la consulta'})
           return res.status(200).send({facturaEncontrada})
       })
   }else{
       return res.status(500).send({mensaje: 'no tiene los permisos necesarios'})
   }
   }
   
   function obtenerFacturaId(req, res){
       if(req.usuario.rol ==='ADMIN'){
           var idFactura = req.params.idFactura
               Factura.findById(idFactura, (err, facturaEncontrada)=>{
                   if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                   if(!facturaEncontrada) return res.status(500).send({mensaje: 'error en la consulta2'})    
                   return res.status(200).send(facturaEncontrada.productos)
               }).populate('productos.idProducto', 'nombre precio' )
       }else{
           return res.status(500).send({mensaje: 'no tiene los permisos necesarios'})
       }
   }
   





   function crearPDF(req, res) {
    var max = 10;
    var row = [];
    var content = '';
    var total = 0;
    var min = 1;
    var x = 0;
    var html = `
    <style>
        *{
            font-family: sans-serif;
            box-sizing: border-box;
        }
        h2{
            padding-top: 0;
            padding-bottom: 25px;
            text-align: center;
            border-bottom: 1px solid #A4A4A4;
            font-size: 45px;
        }
        h3 {
            font-size: 14px;
            text-align: left;
            line-height: 4px;
        }
        .bill{
            margin-left: auto;
            margin-right: auto;
            margin-top: 50px;
            padding: 10px;
            width: 450px;
            border: 1px solid black;
        }
        table {
            margin-top: 35px;
            width: 100%;
        }
        th {
            font-size: 14px;
            text-align: left;
        }
        td {
            font-size: 14px;
            text-align: left;
        }
        tr {
            text-align: left;
        }
    </style>
<body>
    
    <div class="bill">
        <h2>Venta Online</i></h2>
            
            <h3>Registro de compras de: ${req.user.nombre}</h3>
            <h3>Fecha:${new Date()}</h3>
            <h3>Dirección:Centro Comercial X</h3>
            <h3>Nit: CF</h3>
            <h3>Numero Caja: ${Math.floor((Math.random() * (max - min + 1)) + min)}</h3>
            <h3>Télefono: 01 800 5452 1254</h3>

            <table>
                <tr>
                    <th>Producto</th>
                    <th>Precio Unidad Q.</th>
                    <th>Total Q.</th>
                </tr>
`;
        Factura.find({ usuarioID: req.user.sub }, (err, FacturaEncontrado) =>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
            if(!FacturaEncontrado) return res.status(500).send({ mensaje: 'No se encontro ningun registro en compras' })
            
            Producto.find({ usuarioID: req.user.sub }, (err, ProductoEncontrado) =>{
                if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
                if(!ProductoEncontrado) return res.status(500).send({ mensaje: 'No se encontro ningun registro en compras' })
                
                carritoModel.find({ usuarioID: req.user.sub }, (err, cartFind) =>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
                    if(!cartFind) return res.status(500).send({ mensaje: 'No se encontro ningun registro en compras' })

            
            while ((x < ProductoEncontrado.length && x < FacturaEncontrado.length && x <cartFind.length)){
                row[x] = `
                <tr>
                    <td> ${ProductoEncontrado[x].nombre} </td>
                    <td> ${ProductoEncontrado[x].precio} </td>
                    <td> ${cartFind[x].total} </td>

                </tr>
                `;
                content+=row[x]
                total = total + (FacturaEncontrado[x].precio * FacturaEncontrado[x].cantidad)
                x++;
            }
            content = html + content + `<tr>
        <th><strong>
            Productos
            </strong></th>
            <th></th>
            <th></th>
            <th><strong>
            </strong></th>
        </tr><tr>
            <th>${x}</th>
            <th></th>
            <th></th>
            <th><strong>
                ${total}
            </strong></th>
        </tr>
            </table></div></body>`
            pdf.create(content).toFile(`./Factura De ${req.user.nombre}.pdf`, function(err, res) {
                if (err){
                    console.log(err);
                } else {
                    console.log(res);
                }
            })
            return res.status(200).send({ mensaje: 'Pdf creado con exito!' })
        })})})

}



module.exports = {
    crearFactura,
    crearPDF,
    obtenerFacturas,
    obtenerFacturaId,
}

