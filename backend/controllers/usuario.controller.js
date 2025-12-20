const usuariosModel = require("../models/usuario.models");

const db = require("../config/db");
const bcrypt = require('bcrypt');


async function registroUsuario(req, res) {
  const { id_usuario, nombre,telefono,correo,contraseña_hash,id_rol} = req.body;

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
        return res.status(400).json({ message: 'El Numero de Identificacion del Usuario ya esta Registrado' });
      }

    //Verificar si el correo ya existe
      const [correoExistente] = await db.query(
       'SELECT correo FROM usuarios WHERE correo = ?',
        [correo]
      );

      if (correoExistente.length > 0) {
        return res.status(400).json({ message: 'El Correo ya está Registrado' });
      }

    // Insertar el nuevo usuario
    await db.query(
      `INSERT INTO usuarios (id_usuario, nombre,telefono,correo,contraseña_hash,id_rol)
       VALUES (?, ?, ?, ?, ?,?)`,
      [id_usuario, nombre,telefono,correo,hash,id_rol|| null]
    );

    res.status(201).json({ 
      message: 'Usuario registrado correctamente',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

async function obtenerPerfilUsuario(req, res) {
  const { id } = req.params;

  console.log(" ID recibido:", id);

  try {
    const datosUsuario = await usuariosModel.obtenerDatosUsuario(id);



    res.status(200).json(datosUsuario);
  } catch (err) {
    console.error("❌ Error backend:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
}




async function editarPerfilUsuario(req, res) {
  const { id_usuario } = req.params;
  const { nombre, telefono, correo } = req.body;

  try {
    if (!nombre || !telefono || !correo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }


    // Verificar si el correo pertenece a otro usuario
    const [correoExistente] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ? AND id_usuario != ?',
      [correo, id_usuario]
    );

    if (correoExistente.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }



    // Actualizar usuario
    await db.query(
      `UPDATE usuarios 
       SET nombre = ?, telefono = ?, correo = ? WHERE id_usuario = ?`,
      [nombre, telefono, correo, id_usuario]
    );

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

async function actualizarAvatar(req, res) {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ninguna imagen' });
    }

    const avatarUrl = req.file.path; // URL Cloudinary

    await db.query(
      `UPDATE usuarios 
       SET img_usuario = ?
       WHERE id_usuario = ?`,
      [avatarUrl, id]
    );

    res.status(200).json({
      message: 'Avatar actualizado correctamente',
      imagen: avatarUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

  





module.exports = { registroUsuario,editarPerfilUsuario,obtenerPerfilUsuario,actualizarAvatar};





