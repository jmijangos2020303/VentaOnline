

const controladorEmpresas = require('../controllers/empresas.controller');


const Empresas = require('../models/empresas.model');
const Empleados = require('../models/empleados.model');
const mongoose = require('mongoose');




//dependencias
const PDFDocument = require('pdfkit');
const fs = require('fs');


function creandoPdf() {
    //nuevo documento
    const doc = new PDFDocument;
    
    doc.pipe(fs.createWriteStream('Empleados.pdf'));

    //datos complementarios
    doc.info.Title = "Prueba para crear un documento PDF";
    doc.info.Author = "Jose Flavio Xavier Mijangos Vasquez";

    //CONTENIDO
    doc.fontSize(20);
    doc.text();

    doc.fontSize(12);
    doc.moveDown();
    doc.text("TEXTO DE PRUEBA QUE DEBERIA ESTAR EN EL CENTRO", {
        width: 410,
        align: 'center'
    });

    const masTexto = "Agregando más texto de prueba para ver si funciona agregar el contenido de esta constante al documento en pdf";
    doc.text(masTexto, {
        align: 'center',
        oblique: true
    })

    doc.moveDown();
    doc.moveDown();
    doc.text("Baje 2 espacios, ¿No?", {
        height: 50,
        align: 'right'
    });


    doc.end();
}


/*stream.on('finish', function () {

    //obtener la URL del blob con el documento
    const url = stream.toBlobURL('application/pdf');
    iframe.src = url;
})*/

module.exports = {
    creandoPdf
}