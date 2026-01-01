const db = require("../config/db.config");


const getAllUsuarios = (callback) => {
  db.query("SELECT * FROM usuarios", callback);
};

async function findUserByUsername(username) {
  const [rows] = await db.query("SELECT * FROM Usuarios WHERE username = ?", [
    username,
  ]);
  return rows[0];
}

async function findByCorreo(correo){
  const [rows] = await db.query("SELECT * FROM Usuarios where correo =?",correo,[]);
  return rows [0];
}

async function getRolById(id_rol) {
  const [rows] = await db.query("SELECT rol FROM roles WHERE id_rol = ?", [
    id_rol,
  ]);
  return rows[0]?.rol;
}


async function obtenerDatosUsuario(id_usuario) {
  const [rows] = await db.query(
    "SELECT * FROM Usuarios WHERE id_usuario = ?",
    [id_usuario]
  );
  return rows[0] || null;
}

// En models/usuario.models.js
async function obtenerInstructores(id_rol) {
  const [rows] = await db.query(
    "SELECT * FROM Usuarios WHERE id_rol = ? ORDER BY nombre",
    [id_rol]
  );
  return rows; 
}


module.exports = {
  getAllUsuarios,
  findUserByUsername,
  getRolById,
  findByCorreo,
  obtenerDatosUsuario,
  obtenerInstructores
  };