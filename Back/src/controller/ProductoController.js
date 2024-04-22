const Producto = require("../models/Productos");
const Cuenta = require("../models/Cuenta")
const Nevera = require("../models/Nevera")
const ProductoController = {

    async ShowListaTotal(req, res) {
        try {
            console.log("hola")
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
            const neveras = await Nevera.find();
            console.log(neveras)
            const ProductsMap = Productos.filter(Product => Product.nevera == req.params.nevera)
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
    async crearProducto(req, res) {
        const nombrenuevo = req.body.nombre
        const id = Math.random() * (9999 - 1) + 1;
        const Productos = await Producto.find();
        const bandera = Productos.find(({ nombre }) => nombre === nombrenuevo);
        if (!bandera) {
            const { id, nombre, imagen, tipo, cantidad, precio } = req.body;
            const creado = await Producto.create(req.body);
            res.send(JSON.stringify(creado))
        } else {

            res.send(JSON.stringify("Error, Ya existe"))
        }


    }
};

module.exports = ProductoController;