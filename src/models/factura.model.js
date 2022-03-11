
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    idUsuario: { type: Schema.ObjectId, ref: 'Usuario' },
    productos: [{
        idProducto: { type: Schema.ObjectId, ref: 'Productos' },
        nombre: String,
        precio: Number,
        cantidad: Number
    }],
    total: {type: Number, default: 0}
})

module.exports = mongoose.model('Facturas', FacturaSchema);