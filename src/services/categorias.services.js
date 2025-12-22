import API from "@/services/axios";

export const categoriasService = {
  // Obtener todas las categorías
  async obtenerCategorias() {
    try {
      const res = await API.get("/categorias");
      return res.data;
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      throw err.response?.data || { message: "Error al obtener categorías" };
    }
  },

  // Obtener una categoría por ID
  async obtenerCategoria(id) {
    try {
      const res = await API.get(`/categorias/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener categoría:", err);
      throw err.response?.data || { message: "Error al obtener categoría" };
    }
  },

  // Crear nueva categoría
  async crearCategoria(categoriaData, imagen) {
    try {
      const formData = new FormData();
      formData.append("nombre_categoria", categoriaData.nombre_categoria);
      formData.append("descripcion_categoria", categoriaData.descripcion_categoria);
      formData.append("insignia", categoriaData.insignia);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await API.post("/categorias/registrar", formData, {
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
  async actualizarCategoria(id, categoriaData, imagen) {
    try {
      const formData = new FormData();
      formData.append("nombre_categoria", categoriaData.nombre_categoria);
      formData.append("descripcion_categoria", categoriaData.descripcion_categoria);
      formData.append("insignia", categoriaData.insignia);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await API.put(`/categorias/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      throw err.response?.data || { message: "Error al actualizar categoría" };
    }
  },

  // Eliminar categoría
  async eliminarCategoria(id) {
    try {
      const res = await API.delete(`/categorias/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      throw err.response?.data || { message: "Error al eliminar categoría" };
    }
  },
};