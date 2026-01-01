const db = require("../config/db.config");

async function obtenerModulosByCurso(id_curso) {
  const [rows] = await db.query(
  `SELECT * FROM Modulos WHERE id_curso = ? ORDER BY titulo`,
  [id_curso]
  );
  return rows[0];
}


module.exports = {
  obtenerModulosByCurso
};
