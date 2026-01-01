const db = require("../config/db.config");

async function obtenerLeccionesByModulo(id_modulo) {
  const [rows] = await db.query(
  `SELECT * FROM Lecciones WHERE id_curso = ? ORDER BY titulo`,
  [id_modulo]
  );
  return rows[0];
}


module.exports = {
  obtenerLeccionesByModulo
};
