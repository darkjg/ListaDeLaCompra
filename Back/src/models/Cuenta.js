/*
- email
- Contraseña
*/

const mongoose = require("mongoose")

const CuentaSchema = new mongoose.Schema({
    email: String,
    password: String,
    neveraId: Number,
    listas: Array
}, { timestamps: true })

const Cuenta = mongoose.model("cuenta", CuentaSchema)

module.exports = Cuenta