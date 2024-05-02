const express = require("express");
const ProductoController = require("../controller/ProductoController.js");
const NeveraController =require("../controller/NeveraController.js");
const CuentaController=require("../controller/CuentaController.js")
const ListaController=require("../controller/ListaController.js")
const RecetasController= require("../controller/RecetasController.js")
const router = express.Router();

router.get("/", ProductoController.ShowListaTotal);

router.get("/producto/:productId", ProductoController.showProductById);
router.post("/producto",ProductoController.crearProducto)

router.get("/nevera/:nevera", NeveraController.ShowNeveraById);
router.post("/nevera/create",NeveraController.CrearNevera)
router.put("/nevera/update/:neveraId",NeveraController.ActualizarNevera)


router.post("/cuenta/crear",CuentaController.registro)
router.post("/cuenta/nevera",CuentaController.ActualizarUsuarioNevera)
router.post("/cuenta/login",CuentaController.Login)


router.post("/lista/crear", ListaController.CrearLista);
router.put("/lista/actualizar/:id", ListaController.ActualizarLista);
router.delete("/lista/eliminar/:id", ListaController.EliminarLista);
router.get("/lista/buscar/:email", ListaController.BuscarListas);
router.get('/lista/:id', ListaController.ObtenerListaPorId);
router.post("/lista/completar/:id", ListaController.CompletarLista);

router.get("/recetas", RecetasController.obtenerTodasRecetas);
router.get("/recetas/:id", RecetasController.obtenerRecetaPorId);
router.post("/recetas", RecetasController.crearReceta);
router.put("/recetas/:id", RecetasController.actualizarReceta);
router.delete("/recetas/:id", RecetasController.eliminarReceta);
router.post("/recetas/obtener/", RecetasController.obtenerRecetasPorIngredientes);
router.get("/recetasDisponibles", RecetasController.obtenerRecetasDisponibles);
router.get("/recetas/obtener/Top", RecetasController.obtenerMejorRecetaDelMes);
router.get("/recetas/obtener/:nombreIngrediente", RecetasController.obtenerRecetasPorIngrediente);

module.exports = router;