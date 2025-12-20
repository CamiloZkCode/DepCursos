const express = require('express');
const router = express.Router();
const { registrarCategoria } = require('../controllers/categorias.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/crearCategoria',registrarCategoria,verificarToken,)