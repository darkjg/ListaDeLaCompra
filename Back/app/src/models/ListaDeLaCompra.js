/*
- IdNevera
- Productos a comprar [Producuto:nombre,Cantidad:numero]
*/

const mongoose = require("mongoose")

const ListaSchema = new mongoose.Schema({

    id: Number,   
    idCuenta:Number,
    NombreLista:String,
    Productos: Array,   
}, { timestamps: true })

const Lista = mongoose.model("Lista", ListaSchema)

module.exports = Lista