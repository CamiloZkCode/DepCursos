const express = require('express');
const router = express.Router();
const { login, logout, verifySession } = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

// Rutas públicas
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/verify', verificarToken, verifySession);

module.exports = router;