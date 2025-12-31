const express = require('express');
const router = express.Router();
const {crearCurso,obtenerCursos,actualizarCurso} = require('../controllers/cursos.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');
const { upload } = require("../config/cloudinary.config");


router.get('/obtenerCursos',obtenerCursos)

router.post('/crearCursos',verificarToken, verificarRoles('admin'),upload.single('img_portada'), crearCurso);

router.put('/editarCurso/:id',verificarToken, verificarRoles('admin'),upload.single('img_portada'),actualizarCurso);

module.exports = router;
