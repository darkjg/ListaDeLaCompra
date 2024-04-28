/*
- Id De Nevera
- Productos en nevera
*/

const mongoose = require("mongoose")

const CuentaSchema = new mongoose.Schema({
    nombre: String, // Nombre del producto
    cantidad: Number, // Cantidad del producto
    tipo: String // Tipo de cantidad (ej. unidades, kg, litros)
}, { timestamps: true })

const Nevera = mongoose.model("Nevera", CuentaSchema)

module.exports = Nevera