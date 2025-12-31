import API from "@/services/axios";

export const cursoService = {
  // Obtener todas las categorías
  async obtenerCursos() {
    try {
      const res = await API.get("/cursos/obtenerCursos");
      return res.data;
    } catch (err) {
      console.error("Error al obtener cursos:", err);
      throw err.response?.data || { message: "Error al obtener cursos" };
    }
  },

  // Crear nueva categoría
  async crearCurso(formData) {
    try {
      const res = await API.post("/cursos/crearCursos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error al crear curso:", err);
      throw err.response?.data || { message: "Error al crear curso" };
    }
  },

  // Actualizar categoría
  async actualizarCurso(id, formData) {
    try {
      const res = await API.put(`/cursos/editarCurso/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error al actualizar curso:", err);
      throw err.response?.data || { message: "Error al actualizar curso" };
    }
  }
};