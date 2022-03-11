
const mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var carritoSchema = Schema({
    idUsuario: { type: Schema.ObjectId, ref: 'Usuarios' },
    productos: [{
        idProducto: { type: Schema.ObjectId, ref: 'Productos' },
        nombre: String,
        precio: Number,
        cantidad: Number,
        subTotal:Number
    }],
    total: {type: Number, default: 0}
})

module.exports = mongoose.model('carrito', carritoSchema);