// routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const { obtenerCategorias, registrarCategoria, actualizarCategoria } = require('../controllers/categorias.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');
const { upload } = require("../config/cloudinary.config");

router.get('/obtenerCategorias',verificarToken,obtenerCategorias);
router.post('/crearCategorias',verificarToken, verificarRoles('admin'),upload.single('img_categoria'), registrarCategoria);
// Actualizar categoría (solo admin)
router.put('/editarCategoria/:id',verificarToken, verificarRoles('admin'),upload.single('img_categoria'),actualizarCategoria);

module.exports = router;

