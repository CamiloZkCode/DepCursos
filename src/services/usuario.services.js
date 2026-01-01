import API from "@/services/axios";

export async function registroUsuario(usuario) {
  try {
    const res = await API.post("/usuario/registroUsuario", usuario);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function actualizarAvatarUsuario(idUsuario, imagen) {
  try {
    const formData = new FormData();
    formData.append("imagen", imagen);

    const res = await API.put(
      `/usuario/usuarios/${idUsuario}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function obtenerDatosPerfil(id_usuario) {
  try {

    const res = await API.get(`/usuario/datosUsuario/${id_usuario}`);

    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function actualizarDatosPerfil(id_usuario, datos) {
  try {
    const res = await API.put(`/usuario/usuarios/${id_usuario}`, datos);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function cambiarContrasenaUsuario(id_usuario, passwords) {
  try {
    const res = await API.put(`/usuario/usuarios/${id_usuario}/contrasena`, passwords);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function obtenerInstructores(id_rol = 3) {
  try {
    const res = await API.get(`/usuario/obtenerInstructores/${id_rol}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
