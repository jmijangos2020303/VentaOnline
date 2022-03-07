
const mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var CartSchema = Schema({
    nombreProducto: String,
    precioProducuto: Number,
    cantidadCompra: Number,
    productoID: { type: Schema.Types.ObjectId, ref: 'Productos' },
    usuarioID: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Carrito', CartSchema);