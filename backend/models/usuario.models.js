const db = require("../config/db");


const getAllUsuarios = (callback) => {
  db.query("SELECT * FROM usuarios", callback);
};

async function findUserByUsername(username) {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ?", [
    username,
  ]);
  return rows[0];
}
module.exports = {
  getAllUsuarios,
  findUserByUsername


  };