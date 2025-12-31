const db = require("../config/db.config");

async function obtenerCursos() {
  const [rows] = await db.query(
    "SELECT * FROM Cursos ORDER BY titulo_curso"
  );
  return rows;
}


module.exports = {
  obtenerCursos
};
