const express = require('express');
const router = express.Router();
const {} = require('../controllers/modulos.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/modulo',verificarToken,crearCurso)
router.get('/obtenerCursos',verificarToken,obtenerCursos)

module.exports = router;