const express = require('express');
const router = express.Router();

const {  upload, handleUploadErrors } = require("../config/cloudinary.config");


const { registroUsuario,editarPerfilUsuario,obtenerPerfilUsuario,actualizarAvatar, cambiarContrasena,
        obtenerInstructores
} = require('../controllers/usuario.controller');

const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


router.post('/registroUsuario',registroUsuario);
router.put('/usuarios/:id',verificarToken,editarPerfilUsuario)
router.put("/usuarios/:id/avatar",verificarToken,upload.single("imagen"),handleUploadErrors, actualizarAvatar );

router.put('/usuarios/:id/contrasena', verificarToken, cambiarContrasena);

router.get('/datosUsuario/:id',verificarToken, obtenerPerfilUsuario);

// En routes/usuario.routes.js
router.get("/obtenerInstructores/:id_rol", verificarToken,obtenerInstructores);
module.exports = router; 

