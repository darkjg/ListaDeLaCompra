const Producto = require("../models/Productos");


const ProductoController = {
    async ShowListaTotal(req, res) {
        try {
            const Productos = await Producto.find();
            res.send(JSON.stringify(Productos))
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    },
    async ShowListaByIdNevera(req,res){
        
    }
}
module.exports = ProductoController