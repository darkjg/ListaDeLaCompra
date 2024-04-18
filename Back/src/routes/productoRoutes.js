const express = require("express");
const ProductoController = require("../controller/ProductoController.js");
const NeveraController =require("../controller/NeveraController.js");
const router = express.Router();

router.get("/", ProductoController.ShowListaTotal);
router.get("/nevera/:nevera", ProductoController.ShowListaByIdNevera);
router.get("/producto/:productId", ProductoController.showProductById);
router.post("/producto",ProductoController.crearProducto)

router.post("/nevera/create",NeveraController.CrearNevera)
router.put("/nevera/update",NeveraController.ActualizarNevera)

module.exports = router;