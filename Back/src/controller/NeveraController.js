const Nevera = require("../models/Nevera")




const NeveraController = {

    async ShowNeveras(req, res) {
        try {

            const Neveras = await Nevera.find();

            res.send(JSON.stringify(Neveras))
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    },
    async ShowNeveraById(req, res) {
        try {
            
            const nevera = await Nevera.findById(req.params.nevera);
            
            res.send(JSON.stringify({ nevera }));
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
    ,
    async CrearNevera(req, res) {
        const nombrenuevo = req.body.nombre

        const Neveras = await Nevera.find();
        const bandera = Neveras.find(({ nombre }) => nombre === nombrenuevo);

        if (!bandera) {

            const { id, Productos } = req.body;
            const creado = await Nevera.create(req.body);
            res.send(JSON.stringify(creado))
        } else {

            res.send(JSON.stringify("Error, Ya existe"))
        }


    },

    async ActualizarNevera(req, res) {
        const { nombre,productos } = req.body;
        const id = req.params.neveraId;
        
        try {
            let neveraExistente = await Nevera.findById(id);
           
            if (!neveraExistente) {
                return res.status(404).json({ error: "La nevera no existe" });
            }
    
            // Actualizar el nombre de la nevera si se proporciona
            if (nombre) {
                neveraExistente.nombre = nombre
            }
    
            // Actualizar productos
            if (productos) {
                neveraExistente.productos = productos
            }
    
            // Guardar los cambios en la base de datos
            await neveraExistente.save();
            
            res.json(neveraExistente);
        } catch (error) {
            console.error("Error al actualizar la nevera:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = NeveraController;