
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
        nombreCategoria: String,
        descripcion: String
});

module.exports = mongoose.model('Categorias', CategorySchema);