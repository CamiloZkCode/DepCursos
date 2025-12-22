const usuariosModel = require("../models/usuario.models");
const {
  uploadToCloudinary,
  eliminarAvatarAntiguo,
} = require("../config/cloudinary");
const db = require("../config/db");
const bcrypt = require("bcrypt");

async function registroUsuario(req, res) {
  const { id_usuario, nombre, telefono, correo, contraseña_hash, id_rol } =
    req.body;

  try {
    // Validar que los campos obligatorios estén presentes
    if (!id_usuario || !nombre || !telefono || !correo || !contraseña_hash) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const hash = await bcrypt.hash(contraseña_hash, 10);

    // Verificar si el usuario ya existe
    const [existing] = await db.query(
      "SELECT * FROM Usuarios WHERE id_usuario = ?",
      [id_usuario]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({
          message: "El Numero de Identificacion del Usuario ya esta Registrado",
        });
    }

    //Verificar si el correo ya existe
    const [correoExistente] = await db.query(
      "SELECT correo FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (correoExistente.length > 0) {
      return res.status(400).json({ message: "El Correo ya está Registrado" });
    }

    // Insertar el nuevo usuario
    await db.query(
      `INSERT INTO usuarios (id_usuario, nombre,telefono,correo,contraseña_hash,id_rol)
       VALUES (?, ?, ?, ?, ?,?)`,
      [id_usuario, nombre, telefono, correo, hash, id_rol || null]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
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
  const { id } = req.params;
  const { nombre, telefono, correo, pais, departamento } = req.body;

  try {
    if (!nombre || !telefono || !correo) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [correoExistente] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ? AND id_usuario != ?",
      [correo, id]
    );

    if (correoExistente.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    await db.query(
      `UPDATE usuarios 
       SET nombre = ?, telefono = ?, correo = ?, pais = ?, departamento = ? 
       WHERE id_usuario = ?`,
      [nombre, telefono, correo, pais || null, departamento || null, id]
    );

    res.status(200).json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
}

//ActualizaAvatar y elimina el anterior del cloud
async function actualizarAvatar(req, res) {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se envió ninguna imagen",
      });
    }

    // 1. Obtener public_id actual del usuario
    const [usuarioActual] = await db.query(
      `SELECT nombre,img_public_id FROM usuarios WHERE id_usuario = ?`,
      [id]
    );

    const publicIdAntiguo = usuarioActual[0]?.img_public_id;
    const nombreUsuario = usuarioActual[0]?.nombre_usuario || `usuario_${id}`;

    // Subir imagen a Cloudinary en carpeta específica para avatar Usuario
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: "lms/avatares", // Carpeta específica para categorías
      public_id: `user_${Date.now()}_${nombreUsuario.toLowerCase().replace(/\s+/g, "_")}`,
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
        { quality: "auto:good" },
      ],
    });

    const avatarUrl = uploadResult.secure_url;
    const nuevoPublicId = uploadResult.public_id;

    // 3. Actualizar en base de datos
    await db.query(
      `UPDATE usuarios 
       SET img_usuario = ?, img_public_id = ?, actualizado = NOW()
       WHERE id_usuario = ?`,
      [avatarUrl, nuevoPublicId, id]
    );

    // 4. Eliminar avatar antiguo de Cloudinary (asincrónico, no bloqueante)
    if (publicIdAntiguo) {
      eliminarAvatarAntiguo(publicIdAntiguo).catch(console.error);
    }

    // 5. Respuesta
    res.status(200).json({
      success: true,
      message: "Avatar actualizado correctamente",
      data: {
        imagen: avatarUrl,
        publicId: nuevoPublicId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function cambiarContrasena(req, res) {
  const { id } = req.params;
  const { contrasenaActual, nuevaContrasena } = req.body;

  try {
    if (!contrasenaActual || !nuevaContrasena) {
      return res
        .status(400)
        .json({ message: "Faltan la contraseña actual o la nueva" });
    }

    // Buscar usuario
    const [rows] = await db.query(
      "SELECT contraseña_hash FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Verificar contraseña actual
    const coincide = await bcrypt.compare(
      contrasenaActual,
      usuario.contraseña_hash
    );
    if (!coincide) {
      return res
        .status(401)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    // Hash de la nueva contraseña
    const hashNueva = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar en BD
    await db.query(
      "UPDATE usuarios SET contraseña_hash = ? WHERE id_usuario = ?",
      [hashNueva, id]
    );

    res.json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
}

module.exports = {
  registroUsuario,
  editarPerfilUsuario,
  obtenerPerfilUsuario,
  actualizarAvatar,
  cambiarContrasena,
};
