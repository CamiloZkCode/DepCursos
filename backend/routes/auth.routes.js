const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/login', login);

module.exports = router;