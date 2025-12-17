const express = require('express');
const router = express.Router();
const { registroUsuario } = require('../controllers/usuario.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/registroUsuario',registroUsuario);

module.exports = router; 

