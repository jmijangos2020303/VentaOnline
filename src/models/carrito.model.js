
const mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var CartSchema = Schema({
    nombreP: String,
    precioP: Number,
    cantidadCompra: Number,
    productoID: { type: Schema.Types.ObjectId, ref: 'Productos' },
    usuarioID: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Carrito', CartSchema);