const express = require('express');
const router = express.Router();
const {crearModulo,actualizarModulo,obtenerModulosByCurso} = require('../controllers/modulos.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/modulo',verificarToken,crearModulo)
router.put('/actualizarModulo',verificarToken,actualizarModulo)
router.get('/obtenerModulosByCurso',obtenerModulosByCurso)

module.exports = router;