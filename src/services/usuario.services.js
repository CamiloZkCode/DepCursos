import API from "@/services/axios";

export async function registroUsuario(usuario) {
  try {
    const res = await API.post("/usuario/registroUsuario", usuario);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}