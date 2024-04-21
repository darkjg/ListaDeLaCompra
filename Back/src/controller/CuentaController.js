const Cuenta = require("../models/Cuenta")
const session = require("express-session");
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');



const CuentaController = {
    async registro(req, res) {
        const { email, password, Productos } = req.body;        
       
        const Cuentas = await Cuenta.find();
        const user = Cuentas.find((user) => user.email === email );
        console.log(user)
        if(!user){
            const creada= await Cuenta.create(req.body);
            res.send(JSON.stringify(creada))
        }else{
            res.send(JSON.stringify("Error la cuenta ya existe"))
        }
       
    },
    async ActualizarUsuarioNevera(req, res) {
        const user = req.userCredential.user
        console.log(user)
        if (!user) {
            await user?.updateNeveraID(req.IdNevera)
        }
        console.log(user)
    },

    async Login(req, res) {
        const { email, password } = req.body

        const Cuentas = await Cuenta.find();

        const user = Cuentas.find((user) => user.email === email  && user.password === password);

        console.log(user)
        if (user) {
            const token = generateToken(user);
            req.session.token = token;
            console.log(req.session.cookie)
            res.send({"user":user,"token":token})
        }else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    }

}
module.exports = CuentaController;