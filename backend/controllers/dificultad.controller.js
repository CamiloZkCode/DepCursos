const Dificultad = require("../models/dificultad.models");

//Obtener todas las dificultades
async function obtenerDificultades(req, res) {
  try {
    const dificultades = await Dificultad.obtenerDificultades();

    res.status(200).json({
      success: true,
      data: dificultades
    });
  } catch (error) {
    console.error("Error al obtener dificultades:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener dificultades"
    });
  }
}

module.exports = {
  obtenerDificultades
};
