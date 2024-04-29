/*
- Id De Nevera
- Productos en nevera
*/

const mongoose = require("mongoose");

const NeveraSchema = new mongoose.Schema({
    nombre: String, // Nombre de la nevera
    productos: [{ 
        nombre: String, // Nombre del producto
        cantidad: Number, // Cantidad del producto
        tipo: String // Tipo de cantidad (ej. unidades, kg, litros)
    }]
}, { timestamps: true });

const Nevera = mongoose.model("Nevera", NeveraSchema);

module.exports = Nevera;