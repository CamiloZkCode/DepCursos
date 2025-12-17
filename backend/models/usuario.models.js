const db = require("../config/db");


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
module.exports = {
  getAllUsuarios,
  findUserByUsername,
  getRolById,
  findByCorreo
  };