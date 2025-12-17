const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getRolById,findByCorreo } = require("../models/usuario.models");


async function login(req, res) {
if (!req.body) {
    return res.status(400).json({ 
      message: "Cuerpo de la solicitud no recibido",
      error: "req.body is undefined" 
    });
  }
  
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ 
      message: "Faltan campos requeridos",
      receivedBody: req.body // Para debug
    });
  }

  //Buscar correo en la tabla y verificar que exista
  const user = await findByCorreo(correo);
  if (!user) return res.status(401).json({ message: "Correo no registrado" });

  
 
  //validar contraseña
  const match = await bcrypt.compare(contraseña, user.contraseña_hash);
  if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

  const rol = await getRolById(user.id_rol);

 

  const token = jwt.sign(
    {
      id_usuario: user.id_usuario,
      rol,
      id_rol: user.id_rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id_usuario,
      nombre: user.nombre,
      rol,
      id_rol: user.id_rol,
    },
  });
}

module.exports = { login };
