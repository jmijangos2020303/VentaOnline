const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String,
    facturaDetail: [],
    carrito: [{
        name: String,
        price: Number,
        stock: Number}],
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);