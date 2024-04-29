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
        const { nombre, productos } = req.body;
        const id = req.params.neveraId;
        
        try {
            let nevera = await Nevera.findById(id);
           
            if (!nevera) {
                return res.status(404).json({ error: "La nevera no existe" });
            }
            if (nombre) {
                nevera.nombre = nombre;
            }
            if (productos) {
                // Verificar si el producto ya existe en la nevera
                const existingProductIndex = nevera.productos.findIndex(p => p.nombre === productos.nombre);
                if (existingProductIndex !== -1) {
                    // Si existe, actualizar la cantidad y el tipo
                    nevera.productos[existingProductIndex].cantidad = productos.cantidad;
                    nevera.productos[existingProductIndex].tipo = productos.tipo;
                } else {
                    // Si no existe, agregar el nuevo producto
                    nevera.productos.push({
                        nombre: productos.nombre,
                        cantidad: productos.cantidad,
                        tipo: productos.tipo
                    });
                }
            }
            await nevera.save();
            res.json(nevera);
        } catch (error) {
            console.error("Error al actualizar la nevera:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = NeveraController;