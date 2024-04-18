const Nevera = require("../models/Nevera")
const Cuenta = require("../models/Cuenta")



const NeveraController = {

    async ShowNevera(req, res) {
        try {
            console.log("hola")
            const Neveras = await Nevera.find();
            res.send(JSON.stringify(Neveras))
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    },
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
        const id = req.body.id
        const Neveras = await Nevera.find();
        const existe = Neveras.find(({ id }) => id === id);
        console.log(existe)
        if (existe) {
            console.log(existe)
            existe.Productos = req.body;
            await existe.save();
            res.send(JSON.stringify(existe))

        } else {
            res.send(JSON.stringify("Error,No existe"))
        }
    }

}

module.exports = NeveraController;