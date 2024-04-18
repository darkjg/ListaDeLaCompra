/*
-nombre
-tipo
-imagen
-precio
-cantidad
-Id
-nevera: id del grupo 

Los tipos podran ser  :   "Granos.""Verduras.""Frutas.""Productos lácteos.""Carne.","Pescados"
Cantidad sera en gramos
*/


const mongoose = require("mongoose")

const ProductoSchema = new mongoose.Schema({
    ID:Number,
    nombre: String,   
    imagen: String,
    tipo:  { type: String, enum: ["Granos","Verduras","Frutas","Lacteos","Carne","Pescados"] },
    cantidad:Number,
    precio: Number,    
}, { timestamps: true })

const Producto = mongoose.model("Producto", ProductoSchema)

module.exports = Producto