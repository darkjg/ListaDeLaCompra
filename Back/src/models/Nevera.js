/*
- Id De Nevera
- Productos en nevera
*/

const mongoose = require("mongoose")

const CuentaSchema = new mongoose.Schema({
    id: Number,   
    Productos: Array,   
}, { timestamps: true })

const Nevera = mongoose.model("Nevera", CuentaSchema)

module.exports = Nevera