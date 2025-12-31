import API from "@/services/axios";

export const categoriasService = {
  // Obtener todas las categorías
  async obtenerCategorias() {
    try {
      const res = await API.get("/categorias/obtenerCategorias");
      return res.data;
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      throw err.response?.data || { message: "Error al obtener categorías" };
    }
  },

  // Crear nueva categoría
  async crearCategoria(formData) {
    try {
      const res = await API.post("/categorias/crearCategorias", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error al crear categoría:", err);
      throw err.response?.data || { message: "Error al crear categoría" };
    }
  },

  // Actualizar categoría
  async actualizarCategoria(id, formData) {
    try {
      const res = await API.put(`/categorias/editarCategoria/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      throw err.response?.data || { message: "Error al actualizar categoría" };
    }
  }
};