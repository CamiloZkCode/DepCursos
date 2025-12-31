const db = require("../config/db");

async function obtenerModulosByCurso() {
  const [rows] = await db.query(
    "SELECT * FROM Cursos ORDER BY titulo_curso"
  );
  return rows;
}


module.exports = {
  obtenerModulosByCurso
};
