const express = require('express');
const router = express.Router();
const { registrarCategoria,obtenerCategorias,actualizarCategoria } = require('../controllers/categorias.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/crearCategoria',verificarToken,upload.single('img_categoria'),registrarCategoria,)
router.get('/Categorias',verificarToken,obtenerCategorias)
router.put('/Categorias/:id',verificarToken,upload.single('img_categoria'),actualizarCategoria)


