const Cuenta = require("../models/Cuenta")
const Nevera =require("../models/Nevera")
const session = require("express-session");
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');



const CuentaController = {
    async registro(req, res) {
        const { email, password } = req.body;

        try {
            // Verificar si el usuario ya existe
            const usuarioExistente = await Cuenta.findOne({ email });

            if (usuarioExistente) {
                return res.status(409).send("Error: La cuenta ya existe.");
            }

            // Crear la cuenta
            const nuevaCuenta = await Cuenta.create({ email, password });

            // Crear una nevera asociada a la cuenta
            const nuevaNevera = await Nevera.create({
                nombre: `${email} Nevera`,
                productos: []
            });

            // Asociar la nevera a la cuenta
            nuevaCuenta.nevera = nuevaNevera._id;
            await nuevaCuenta.save();

            res.send("Cuenta registrada exitosamente junto con la nevera asociada.");
        } catch (error) {
            console.error("Error al registrar la cuenta:", error);
            res.status(500).send("Error interno del servidor al registrar la cuenta.");
        }
    },
    async ActualizarUsuarioNevera(req, res) {
        const { email,neveraId } = req.body;
        try {
            const user = await Cuenta.findOne({ email: email });

            if (user) {
                user.neveraId = neveraId;
                const actualizada = await user.save();
                res.send(JSON.stringify(actualizada));
            } else {
                res.send(JSON.stringify("Error, cuenta no encontrada"));
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(JSON.stringify("Error interno del servidor"));
        }
    },

    async Login(req, res) {
        const { email, password } = req.body

        const Cuentas = await Cuenta.find();

        const user = Cuentas.find((user) => user.email === email && user.password === password);

        
        if (user) {
            const token = generateToken(user);
            req.session.token = token;
            
            res.send({ "user": user, "token": token })
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    },
    async crearNuevaNevera(req, res) {
        const { email, nombreNevera } = req.body;

        try {
            // Encontrar la cuenta asociada al email proporcionado
            const cuenta = await Cuenta.findOne({ email });

            if (!cuenta) {
                return res.status(404).send("Error: No se encontró la cuenta asociada al email proporcionado.");
            }

            // Crear una nueva Nevera
            const nuevaNevera = await Nevera.create({
                nombre: nombreNevera,
                productos: []
            });

            // Asociar la nueva Nevera a la cuenta
            cuenta.nevera = nuevaNevera._id;
            await cuenta.save();

            res.send("Nueva nevera creada y asociada a la cuenta exitosamente.");
        } catch (error) {
            console.error("Error al crear una nueva nevera:", error);
            res.status(500).send("Error interno del servidor al crear una nueva nevera.");
        }
    }
}
module.exports = CuentaController;