const Lista = require("../models/ListaDeLaCompra")
const Cuenta = require("../models/Cuenta")

const ListaController = {
    async CrearLista(req, res) {
        try {
            const cuenta = await Cuenta.findOne({ email: req.body.email });
            console.log(cuenta)
            if (cuenta) {
                const id = Math.random() * (9999 - 1) + 1;
                const lista = await Lista.create({ id });
                cuenta.listas.push(lista);
                await cuenta.save();
                res.send(JSON.stringify(lista));
            } else {
                res.send(JSON.stringify("Error, no se ha encontrado la cuenta"));
            }
        } catch (error) {
            console.error("Error al crear lista:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },
    async ActualizarLista(req, res) {
        try {
            const lista = await Lista.findOne({ id: req.params.id });
            if (lista) {
                lista.Productos = req.body.productos;
                await lista.save(); 
                res.send(JSON.stringify(lista));
            } else {
                res.status(404).send(JSON.stringify("Error, Lista no encontrada"));
            }
        } catch (error) {
            console.error("Error al actualizar lista:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    }
};

module.exports = ListaController;