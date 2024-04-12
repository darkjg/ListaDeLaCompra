const express = require("express");
const ProductoController = require("../controller/ProductoController.js");
const router = express.Router();

router.get("/products", ProductoController.ShowListaTotal);
router.get("/products/nevera/:nevera", ProductoController.ShowListaByIdNevera);
router.get("/product/:productId", ProductoController.showProductById);

module.exports = router;