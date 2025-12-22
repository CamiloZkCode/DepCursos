const db = require("../config/db");

async function obtenerCategorias(id_categoria) {
  const [rows] = await db.query(
    "SELECT * FROM Categorias WHERE id_categoria = ?",
    [id_categoria]
  );
  return rows[0] || null;
}

module.exports = {
  obtenerCategorias
};