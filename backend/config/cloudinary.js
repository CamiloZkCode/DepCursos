// config/cloudinary.js - VERSIÓN ACTUALIZADA
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const stream = require("stream");

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// Función para subir desde buffer
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lms/perfiles",
        allowed_formats: ["jpg", "png", "jpeg"],
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};


/**
 * Elimina una imagen de Cloudinary usando su public_id
 * @param {string} publicId - El public_id de la imagen en Cloudinary
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function eliminarAvatarAntiguo(publicId) {
  if (!publicId || publicId.trim() === '') {
    console.log('No hay public_id para eliminar');
    return null;
  }

  try {
    console.log(`Intentando eliminar imagen: ${publicId}`);
    
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true // Opcional: invalida la caché CDN
    });
    
    console.log(`Resultado eliminación ${publicId}:`, result.result);
    return result;
    
  } catch (error) {
    console.error(`Error al eliminar imagen ${publicId}:`, error);
    
    // Si el error es que la imagen no existe, no es crítico
    if (error.message.includes('not found') || error.http_code === 404) {
      console.log(`La imagen ${publicId} ya no existe en Cloudinary`);
      return { result: 'not_found' };
    }
    
    // Relanzar otros errores
    throw error;
  }
}

/**
 * Elimina múltiples imágenes de Cloudinary
 * @param {Array<string>} publicIds - Array de public_ids
 */
async function eliminarMultiplesImagenes(publicIds) {
  if (!publicIds || publicIds.length === 0) {
    return;
  }

  const resultados = [];
  
  for (const publicId of publicIds) {
    try {
      const resultado = await eliminarImagenCloudinary(publicId);
      resultados.push({ publicId, resultado });
    } catch (error) {
      console.error(`Fallo eliminando ${publicId}:`, error);
      resultados.push({ publicId, error: error.message });
    }
  }
  
  return resultados;
}



// Configuración de multer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validar tipo MIME
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, JPEG o PNG"), false);
  }
};

// Crear middleware de upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
  fileFilter: fileFilter,
});

// Middleware para manejar errores de upload
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "El archivo excede el tamaño máximo de 2MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir el archivo: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  upload,
  handleUploadErrors,
  eliminarAvatarAntiguo,
  eliminarMultiplesImagenes

};