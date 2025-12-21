const express = require('express');
const router = express.Router();
const { registrarCategoria } = require('../controllers/categorias.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/crearCategoria',verificarToken,upload.single('img_categoria'),registrarCategoria,)

