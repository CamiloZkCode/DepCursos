const db = require("../config/db");

async function obtenerCategorias() {
  const [rows] = await db.query("SELECT id_categoria, nombre_categoria * FROM categorias ", [
  ]);
  return rows[0];
}

module.exports = {
  obtenerCategorias
};