const usuariosModel = require("../models/usuario.models");

const db = require("../config/db");
const bcrypt = require('bcrypt');



async function registroUsuario(req, res) {
  const { id_usuario, nombre,telefono,correo,contraseña_hash } = req.body;

  try {
    // Validar que los campos obligatorios estén presentes
    if (!id_usuario || !nombre || !telefono|| !correo|| !contraseña_hash) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }


     const hash = await bcrypt.hash(contraseña_hash, 10);
    // Verificar si el usuario ya existe

    const [existing] = await db.query(
      'SELECT * FROM Usuarios WHERE id_usuario = ?',
      [id_usuario]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Insertar el nuevo usuario
    await db.query(
      `INSERT INTO usuarios (id_usuario, nombre,telefono,correo,contraseña_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, nombre,telefono,correo,hash|| null]
    );

    res.status(201).json({ 
      message: 'Usuario registrado correctamente',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}


async function editarPerfilUsuario(req,res) {

  try{

  }catch(err){

    
  }
  
}




module.exports = { registroUsuario};





