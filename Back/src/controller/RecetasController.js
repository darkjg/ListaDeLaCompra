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

    async obtenerRecetasPorProducto(req, res) {
        try {
            const nombreProducto = req.params.nombreProducto;
            const recetas = await Recetas.find({ "productos.nombre": nombreProducto });
    
           
            if (recetas.length === 0) {
                console.log("No se encontraron recetas para este producto");
                
                return;
            }
    
            console.log(recetas + " Aquí están las recetas");
            res.json(recetas);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener las recetas" });
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

            const recetasMesActual = await Recetas.find({
                createdAt: { $gte: primerDiaMesActual, $lte: ultimoDiaMesActual }
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
