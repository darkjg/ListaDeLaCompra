const Lista = require("../models/ListaDeLaCompra")
const Cuenta = require("../models/Cuenta")
const Nevera = require("../models/Nevera");
const ListaController = {
    async CrearLista(req, res) {
        try {
            const cuenta = await Cuenta.findOne({ email: req.body.email });

            console.log(cuenta)
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
            console.log(req.body)
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

            const lista = await Lista.findByIdAndDelete(id);

            const cuenta = await Cuenta.findOne({ email: req.body.email });


            if (lista && cuenta) {

                cuenta.listas = cuenta.listas.filter(lista => lista._id.toString() !== id);

                console.log(cuenta)
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
            console.log(cuenta)
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
            
            const lista = await Lista.findById(listaId);
           
            if (!lista) {
                return res.status(404).send("Lista no encontrada");
            }

            const productos = lista.Productos;

           
            const nevera = await Nevera.findOne({ nombre: "Nombre de tu nevera" }); 
            if (!nevera) {
                return res.status(404).send("Nevera no encontrada");
            }

            // Agregar los productos a la nevera
            nevera.Productos.push(...productos);
            await nevera.save();

            // Eliminar la lista
            await lista.remove();

            res.send("Lista completada con éxito");
        } catch (error) {
            console.error("Error al completar lista:", error);
            res.status(500).send("Error al completar lista");
        }
    }
};

module.exports = ListaController;