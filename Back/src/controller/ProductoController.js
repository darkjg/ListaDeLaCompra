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
    async ShowListaByIdNevera(req, res) {
        try {
            const Productos = await Producto.find();
            ProductsMap = Productos.filter(Product => Product.nevera == req.params.nevera)
            res.send(JSON.stringify(ProductsMap))
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    async showProductById(req, res) {
        try {
            const mostrarProduct = await Producto.findById(req.params.productId);
            res.send(await Template.findByid(mostrarProduct, req));
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    },
    async crearProducto(req,res){
        
    }
};

module.exports = ProductoController;