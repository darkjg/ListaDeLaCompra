const express = require("express");
const ProductoController = require("../controller/ProductoController.js");
const NeveraController =require("../controller/NeveraController.js");
const CuentaController=require("../controller/CuentaController.js")
const ListaController=require("../controller/ListaController.js")
const router = express.Router();

router.get("/", ProductoController.ShowListaTotal);
router.get("/nevera/:nevera", ProductoController.ShowListaByIdNevera);
router.get("/producto/:productId", ProductoController.showProductById);
router.post("/producto",ProductoController.crearProducto)

router.post("/nevera/create",NeveraController.CrearNevera)
router.put("/nevera/update",NeveraController.ActualizarNevera)


router.post("/cuenta/crear",CuentaController.registro)
router.post("/cuenta/nevera",CuentaController.ActualizarUsuarioNevera)
router.post("/cuenta/login",CuentaController.Login)


router.post("/lista/crear", ListaController.CrearLista);
router.put("/lista/actualizar/:id", ListaController.ActualizarLista);
router.delete("/lista/eliminar/:id", ListaController.EliminarLista);
router.get("/lista/buscar/:email", ListaController.BuscarListas);
router.get('/lista/:id', ListaController.ObtenerListaPorId);

module.exports = router;