
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    fecha: String,
    productos:[{
        idProducto: { type: Schema.Types.ObjectId, ref: 'Productos' },
        nombre: String,
        precio: Number,
        cantidad: Number
    }],
    usuarioID:{ type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Facturas', FacturaSchema);