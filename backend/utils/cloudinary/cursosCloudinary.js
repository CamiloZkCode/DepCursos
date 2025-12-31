
const { uploadToCloudinary, cloudinary } = require("../../config/cloudinary.config");

const uploadResultCursos = async (fileBuffer, titulo_curso) => {
  try {
    const uploadResult = await uploadToCloudinary(fileBuffer, {
      folder: "lms/cursos",
      public_id: `cur_${Date.now()}_${titulo_curso.toLowerCase().replace(/\s+/g, '_')}`,
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    
    return uploadResult;
  } catch (error) {
    throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
  }
};

module.exports = { uploadResultCursos };