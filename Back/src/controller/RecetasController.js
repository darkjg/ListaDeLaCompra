const Recetas = require("../models/Recetas");
const Nevera = require("../models/Nevera");

const RecetasController = {
    async obtenerTodasRecetas(req, res) {
        try {
            const recetas = await Recetas.find();
            res.json(recetas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener las recetas" });
        }
    },

    async crearReceta(req, res) {
        try {
            const nuevaReceta = req.body;
            const recetaCreada = await Recetas.create(nuevaReceta);
            res.status(201).json(recetaCreada);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al crear la receta" });
        }
    },

    async actualizarReceta(req, res) {
        try {
            const recetaId = req.params.id;
            const nuevaInfoReceta = req.body;
            const recetaEditada = await Recetas.findByIdAndUpdate(recetaId, nuevaInfoReceta, { new: true });
            if (!recetaEditada) {
                return res.status(404).json({ error: "Receta no encontrada" });
            }
            res.json(recetaEditada);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al actualizar la receta" });
        }
    },

    async eliminarReceta(req, res) {
        try {
            const recetaId = req.params.id;
            const recetaEliminada = await Recetas.findByIdAndDelete(recetaId);
            if (!recetaEliminada) {
                return res.status(404).json({ error: "Receta no encontrada" });
            }
            res.json({ message: "Receta eliminada correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al eliminar la receta" });
        }
    },

    async obtenerRecetasPorIngredientes(req, res) {
        try {

            const ingredientes = req.body.ingredientes;



            const todasLasRecetas = await Recetas.find();


            const recetasEnvio = todasLasRecetas.filter(receta => {

                const ingredientesReceta = receta.ingredientes.map(ingrediente => ingrediente.nombre);

                return ingredientesReceta.every(ingrediente => ingredientes.includes(ingrediente));
            });


            if (recetasEnvio.length === 0) {
                return res.status(404).json({ message: "No se encontraron recetas que se puedan hacer con los ingredientes proporcionados" });
            }


            console.log("Aquí están las recetas:", recetasEnvio);
            res.json(recetasEnvio);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener las recetas" });
        }
    }, 
    async obtenerRecetasPorIngrediente(req, res) {
        try {
            const nombreIngrediente = req.params.nombreIngrediente;

           
            const todasLasRecetas = await Recetas.find();

         
            const recetasConIngrediente = todasLasRecetas.filter(receta =>
                receta.ingredientes.some(ingrediente => ingrediente.nombre === nombreIngrediente)
            );

            if (recetasConIngrediente.length === 0) {
                return res.status(404).json({ message: `No se encontraron recetas que contengan el ingrediente '${nombreIngrediente}'` });
            }

            res.json(recetasConIngrediente);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener las recetas por ingrediente" });
        }
    },

    async obtenerRecetasDisponibles(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "El correo electrónico del usuario es requerido" });
            }

            const neveraUsuario = await Nevera.findOne({ email: email });

            if (!neveraUsuario) {
                return res.status(404).json({ error: "La nevera del usuario no fue encontrada" });
            }

            const productosNevera = neveraUsuario.productos.map(producto => producto.nombre);

            const recetasDisponibles = await Recetas.find({ "productos.nombre": { $in: productosNevera } });

            res.json(recetasDisponibles);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener las recetas disponibles según los productos en la nevera" });
        }
    },

    async obtenerMejorRecetaDelMes(req, res) {

        try {

            const primerDiaMesActual = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const ultimoDiaMesActual = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            console.log(primerDiaMesActual)
            console.log(ultimoDiaMesActual)

            const todasLasRecetas = await Recetas.find();
            const recetasMesActual = todasLasRecetas.filter(receta => {
                const fechaCreacion = new Date(receta.createdAt);
                return fechaCreacion >= primerDiaMesActual && fechaCreacion <= ultimoDiaMesActual;
            });

            let mejorPuntuacion = 0;
            let mejorReceta = null;

            recetasMesActual.forEach(receta => {
                const puntuacionReceta = receta.puntuacion || 0;
                if (puntuacionReceta > mejorPuntuacion) {
                    mejorPuntuacion = puntuacionReceta;
                    mejorReceta = receta;
                }
            });

            res.json(mejorReceta);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener la mejor receta del mes" });
        }
    },


    async obtenerRecetaPorId(req, res) {
        try {
            const recetaId = req.params.id;
            const receta = await Recetas.findById(recetaId);
            if (!receta) {
                return res.status(404).json({ error: "Receta no encontrada" });
            }
            res.json(receta);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener la receta por ID" });
        }
    }
}

module.exports = RecetasController;
