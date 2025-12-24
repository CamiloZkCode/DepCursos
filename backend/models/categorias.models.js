const db = require("../config/db");

async function obtenerCategoria() {
  const [rows] = await db.query(
    "SELECT * FROM Categorias ORDER BY nombre_categoria"
  );
  return rows;
}

module.exports = {
  obtenerCategoria
};
