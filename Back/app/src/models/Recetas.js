const mongoose = require("mongoose");

const RecetasSchema = new mongoose.Schema({
    nombre: String,

    ingredientes: [{
        nombre: String,
        cantidad: Number,
        tipo: String
    }],
    explicacion: String,

    puntuacion: Number
}, { timestamps: true });

const Recetas = mongoose.model("Recetas", RecetasSchema);

module.exports = Recetas;


