const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getRolById, findByCorreo } = require("../models/usuario.models");
const { establecerCookieSegura, limpiarCookieAuth } = require("../middlewares/auth.middlewares");

async function login(req, res) {
  if (!req.body) {
    return res.status(400).json({ 
      success: false,
      message: "Cuerpo de la solicitud no recibido"
    });
  }
  
  const { correo, contraseña, rememberMe } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ 
      success: false,
      message: "Correo y contraseña son requeridos"
    });
  }

  try {
    // Buscar usuario
    const user = await findByCorreo(correo);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    // Validar contraseña
    const match = await bcrypt.compare(contraseña, user.contraseña_hash);
    if (!match) {
      return res.status(401).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    const rol = await getRolById(user.id_rol);

    // Crear token con tiempo de expiración
    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        rol,
        id_rol: user.id_rol,
        nombre: user.nombre,
        correo: user.correo
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Establecer cookie segura (HttpOnly)
    establecerCookieSegura(
      res, 
      token, 
      { maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 }
    );

    // Respuesta SIN token en el cuerpo (solo datos del usuario)
    res.json({
      success: true,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol,
        id_rol: user.id_rol,
        correo: user.correo,
        img_usuario:user.img_usuario
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
}

// Logout
async function logout(req, res) {
  try {
    limpiarCookieAuth(res);
    
    res.json({ 
      success: true,
      message: "Sesión cerrada correctamente" 
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al cerrar sesión" 
    });
  }
}

// Verificar sesión
async function verifySession(req, res) {
  try {
    // Obtener datos completos del usuario desde BD
    const { findByCorreo } = require("../models/usuario.models");
    const usuarioCompleto = await findByCorreo(req.user.correo);
    
    res.json({
      success: true,
      user: {
        id: req.user.id_usuario,
        nombre: req.user.nombre,
        rol: req.user.rol,
        id_rol: req.user.id_rol,
        correo: req.user.correo,
        // Agregar más datos si existen en tu modelo
        img_usuario: usuarioCompleto?.img_usuario || null,
        telefono: usuarioCompleto?.telefono || null
      }
    });
  } catch (error) {
    console.error("Error en verifySession:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar sesión"
    });
  }
}

module.exports = { login, logout, verifySession };