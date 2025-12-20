const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

const { registroUsuario,editarPerfilUsuario,obtenerPerfilUsuario,actualizarAvatar} = require('../controllers/usuario.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/registroUsuario',registroUsuario);
router.put('/usuarios/:id',verificarToken,editarPerfilUsuario)
router.put('/usuarios/:id/avatar',verificarToken,upload.single('imagen'),actualizarAvatar);
router.get('/datosUsuario/:id',verificarToken, obtenerPerfilUsuario);

module.exports = router; 

