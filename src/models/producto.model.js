
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    categoriaID: { type: Schema.Types.ObjectId, ref: 'Categorias' },
    vendidos: Number
});

module.exports = mongoose.model('Productos', ProductoSchema);