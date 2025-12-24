const db = require("../config/db");

//Obtener todas las dificultades (principiante, intermedio, avanzado)
async function obtenerDificultades() {
  const [rows] = await db.query(
    "SELECT * FROM Dificultad ORDER BY id_dificultad"
  );
  return rows;
}


module.exports = {
  obtenerDificultades,
};
