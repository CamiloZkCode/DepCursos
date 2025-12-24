const express = require('express');
const router = express.Router();
const {obtenerDificultades} = require('../controllers/dificultad.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.get('/Obtenerdificultades', verificarToken, obtenerDificultades);

module.exports = router;
