const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware principal para verificar token desde cookies
function verificarToken(req, res, next) {
  try {
    // 1. Obtener token SOLO de cookies (HttpOnly)
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Acceso denegado. No hay sesión activa.' 
      });
    }

    // 2. Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Agregar más datos del usuario si es necesario
    req.user = {
      id_usuario: decoded.id_usuario,
      nombre: decoded.nombre,
      rol: decoded.rol,
      id_rol: decoded.id_rol,
      correo: decoded.correo
    };
    
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    
    // Limpiar cookie si el token es inválido
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    const message = error.name === 'TokenExpiredError' 
      ? 'Sesión expirada' 
      : 'Sesión inválida';
    
    return res.status(401).json({ 
      success: false,
      message,
      redirect: '/login'
    });
  }
}

// Función para establecer cookies seguras
function establecerCookieSegura(res, token, options = {}) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true, // Inaccesible por JavaScript
    secure: isProduction, // Solo HTTPS en producción
    sameSite: isProduction ? 'strict' : 'lax', // 'lax' para desarrollo
    maxAge: options.maxAge || 60 * 60 * 1000, // 1 hora por defecto
    path: '/', // Disponible en toda la app
  };
  
  res.cookie('auth_token', token, cookieOptions);
}

// Función para limpiar cookies
function limpiarCookieAuth(res) {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
}

// Middleware para verificar roles
function verificarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user?.rol) {
      return res.status(403).json({ 
        success: false,
        message: 'Información de rol no disponible' 
      });
    }
    
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        message: 'No tienes permisos para esta acción' 
      });
    }
    next();
  };
}

module.exports = { 
  verificarToken, 
  verificarRoles,
  establecerCookieSegura,
  limpiarCookieAuth
};