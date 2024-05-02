/*
- email
- Contraseña
*/

const mongoose = require("mongoose")

const CuentaSchema = new mongoose.Schema({
    email: String,
    password: String,
    nevera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nevera"
    },
    listas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lista"
    }]
}, { timestamps: true })

const Cuenta = mongoose.model("cuenta", CuentaSchema)

module.exports = Cuenta