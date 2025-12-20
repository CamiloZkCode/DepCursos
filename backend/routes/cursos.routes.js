const express = require('express');
const router = express.Router();
const {crearCurso} = require('../controllers/cursos.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/curso',crearCurso,verificarToken,)