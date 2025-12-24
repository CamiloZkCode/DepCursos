// services/categorias.services.js
import API from "@/services/axios";

export const DificultadServices = {
  // Obtener todas las dificultades
  async obtenerDificultades() {
    try {
      const res = await API.get("/dificultad/Obtenerdificultades");
      return res.data;
    } catch (err) {
      console.error("Error al obtener las dificultades:", err);
      throw err.response?.data || { message: "Error al obtener dificultades" };
    }
  }
};