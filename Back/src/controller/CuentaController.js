const Cuenta = require("../models/Cuenta")
const session = require("express-session");
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');



const CuentaController = {
    async registro(req, res) {
        const { email, password, neveraId } = req.body;

        const Cuentas = await Cuenta.find();
        const user = Cuentas.find((user) => user.email === email);
        console.log(user)
        if (!user) {
            const creada = await Cuenta.create(req.body);
            res.send(JSON.stringify(creada))
        } else {
            res.status(409).send(JSON.stringify("Error la cuenta ya existe"))
        }

    },
    async ActualizarUsuarioNevera(req, res) {
        const { email, password, neveraId } = req.body;
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

        console.log(user)
        if (user) {
            const token = generateToken(user);
            req.session.token = token;
            console.log(req.session.cookie)
            res.send({ "user": user, "token": token })
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    }

}
module.exports = CuentaController;