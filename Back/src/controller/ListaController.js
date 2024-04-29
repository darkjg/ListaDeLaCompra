const Lista = require("../models/ListaDeLaCompra")
const Cuenta = require("../models/Cuenta")
const Nevera = require("../models/Nevera");
const ListaController = {
    async CrearLista(req, res) {
        try {
            const cuenta = await Cuenta.findOne({ email: req.body.email });


            if (cuenta) {
                const id = Math.random() * (9999 - 1) + 1;

                const lista = await Lista.create({ id: id, NombreLista: "Nueva Lista" });
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
            const id = req.params.id

            const lista = await Lista.findById(id);

            if (lista) {

                lista.NombreLista = req.body.nombre || lista.NombreLista;
                lista.Productos = req.body.Productos || lista.Productos;

                const listaActualizada = await lista.save();
                res.send(JSON.stringify(listaActualizada));

            } else {
                res.status(404).send(JSON.stringify("Error, Lista no encontrada"));
            }

        } catch (error) {
            console.error("Error al actualizar lista:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },
    async EliminarLista(req, res) {
        try {
            const id = req.params.id;
            console.log(id)
            const lista = await Lista.findByIdAndDelete(id);

            const cuenta = await Cuenta.findOne({ email: req.body.email });


            if (lista && cuenta) {

                cuenta.listas = cuenta.listas.filter(lista => lista._id.toString() !== id);
                await cuenta.save();

                res.send(JSON.stringify("Lista eliminada correctamente"));
            } else {
                res.status(404).send(JSON.stringify("Error, Lista no encontrada"));
            }

        } catch (error) {
            console.error("Error al eliminar lista:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },
    async BuscarListas(req, res) {
        try {
            const cuenta = await Cuenta.findOne({ email: req.params.email });

            if (cuenta) {
                res.send(JSON.stringify(cuenta.listas));
            } else {
                res.status(404).send(JSON.stringify("Error, Cuenta no encontrada"));
            }
        } catch (error) {
            console.error("Error al buscar listas por email:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },
    async ObtenerListaPorId(req, res) {
        try {

            const lista = await Lista.findById(req.params.id);

            if (lista) {
                res.send(JSON.stringify(lista));
            } else {
                res.status(404).send(JSON.stringify("Error, Lista no encontrada"));
            }
        } catch (error) {
            console.error("Error al obtener lista por ID:", error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },
    async CompletarLista(req, res) {
        try {
            const listaId = req.params.id;
            const { email } = req.body;
            const lista = await Lista.findById(listaId);

            if (!lista) {
                return res.status(404).send("Lista no encontrada");
            }

            const productos = lista.Productos;



            // Buscar la cuenta por el correo electrónico proporcionado
            const cuenta = await Cuenta.findOne({ email });
            if (!cuenta) {
                return res.status(404).send("Cuenta no encontrada");
            }

            const nevera = await Nevera.findById(cuenta.nevera);

            if (!nevera) {
                return res.status(404).send("Nevera no encontrada");
            }
            for (const producto of productos) {
                // Buscar el índice del producto en la nevera por su nombre
                const existingProductIndex = nevera.productos.findIndex(p => p.nombre === producto.nombre);
                if (existingProductIndex !== -1) {
                    // Si existe, actualizar la cantidad y el tipo
                    nevera.productos[existingProductIndex].cantidad = producto.cantidad;
                    nevera.productos[existingProductIndex].tipo = producto.tipo;
                } else {
                    // Si no existe, agregar el nuevo producto
                    nevera.productos.push({
                        nombre: producto.nombre,
                        cantidad: producto.cantidad,
                        tipo: producto.tipo
                    });
                }
            }
            // Agregar los productos a la nevera
            // nevera.productos.push(...productos);
            await Cuenta.updateOne({ _id: cuenta._id }, { $pull: { listas: listaId } });
            // Eliminar la lista
            await Lista.findByIdAndDelete(listaId);
            await nevera.save();
            res.send("Lista completada con éxito");
        } catch (error) {
            console.error("Error al completar lista:", error);
            res.status(500).send("Error al completar lista");
        }
    }
};

module.exports = ListaController;