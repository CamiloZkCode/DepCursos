const db = require("../config/db");
const categoriasModel= require("../models/categorias.models");
const { uploadToCloudinary } = require("../config/cloudinary");


async function registrarCategoria(req, res) {
  const { nombre_categoria, descripcion_categoria, insignia } = req.body;
  
  try {
    // Verificar campos obligatorios
    if (!nombre_categoria || !descripcion_categoria || !insignia) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Verificar si se subió una imagen
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen de la categoría es requerida' });
    }

    // Verificar si la categoría ya existe
    const [existing] = await db.query(
      'SELECT * FROM Categorias WHERE nombre_categoria = ?',
      [nombre_categoria]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'La Categoría ya Existe' });
    }

    // Subir imagen a Cloudinary en carpeta específica para categorías
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: "lms/categorias", // Carpeta específica para categorías
      public_id: `cat_${Date.now()}_${nombre_categoria.toLowerCase().replace(/\s+/g, '_')}`,
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    // Insertar en la base de datos con la URL de Cloudinary
    await db.query(
      `INSERT INTO Categorias (nombre_categoria, img_categoria, descripcion_categoria, insignia)
       VALUES (?, ?, ?, ?)`,
      [
        nombre_categoria,
        uploadResult.secure_url, // URL segura de Cloudinary
        descripcion_categoria,
        insignia
      ]
    );

    res.status(201).json({
      message: 'Categoría Registrada Correctamente',
      data: {
        nombre_categoria,
        img_url: uploadResult.secure_url,
        cloudinary_id: uploadResult.public_id
      }
    });
  } catch (err) {
    console.error('Error al registrar categoría:', err);
    res.status(500).json({ 
      message: 'Error del servidor',
      error: err.message 
    });
  }
}



async function actualizarCategoria(req, res) {
  const { id } = req.params;
  const { nombre_categoria, descripcion_categoria, insignia } = req.body;

  try {
    // 1. Validar que la categoría existe
    const [categoriaExistente] = await db.query(
      `SELECT nombre_categoria, img_categoria, img_public_id 
       FROM Categorias 
       WHERE id_categoria = ?`,
      [id]
    );

    if (categoriaExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    const categoria = categoriaExistente[0];
    const publicIdAntiguo = categoria.img_public_id;
    let nuevoPublicId = publicIdAntiguo;
    let nuevaImagenUrl = categoria.img_categoria;
    let uploadResult = null;

    // 2. Si se envió una nueva imagen, procesarla
    if (req.file) {


      // Subir nueva imagen a Cloudinary
      uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: "lms/categorias",
       public_id: `cat_${Date.now()}_${nombre_categoria.toLowerCase().replace(/\s+/g, '_')}`,
        transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
        ]
      });

      nuevaImagenUrl = uploadResult.secure_url;
      nuevoPublicId = uploadResult.public_id;

      // Eliminar imagen anterior de Cloudinary si existe
      if (publicIdAntiguo) {
        try {
          await cloudinary.uploader.destroy(publicIdAntiguo);
          console.log(`Imagen anterior de categoría eliminada: ${publicIdAntiguo}`);
        } catch (deleteError) {
          console.warn(`No se pudo eliminar imagen anterior ${publicIdAntiguo}:`, deleteError.message);
          // No fallar la operación principal
        }
      }
    }

    // 3. Verificar si el nuevo nombre ya existe (solo si se está cambiando el nombre)
    if (nombre_categoria && nombre_categoria !== categoria.nombre_categoria) {
      const [categoriaConMismoNombre] = await db.query(
        `SELECT id_categoria FROM Categorias 
         WHERE nombre_categoria = ? AND id_categoria != ?`,
        [nombre_categoria, id]
      );

      if (categoriaConMismoNombre.length > 0) {
        // Si subimos una nueva imagen pero el nombre ya existe, revertir
        if (uploadResult && publicIdAntiguo !== nuevoPublicId) {
          try {
            await cloudinary.uploader.destroy(nuevoPublicId);
          } catch (revertError) {
            console.error("Error revirtiendo imagen:", revertError);
          }
        }

        return res.status(400).json({
          success: false,
          message: "Ya existe una categoría con ese nombre"
        });
      }
    }

    // 4. Preparar datos para actualizar
    const datosActualizar = {
      nombre_categoria: nombre_categoria || categoria.nombre_categoria,
      img_categoria: nuevaImagenUrl,
      img_public_id: nuevoPublicId,
      descripcion_categoria: descripcion_categoria || categoria.descripcion_categoria,
      insignia: insignia || categoria.insignia,
    };

    // 5. Actualizar en base de datos
    await db.query(
      `UPDATE Categorias 
       SET nombre_categoria = ?, 
           img_categoria = ?, 
           img_public_id = ?,
           descripcion_categoria = ?, 
           insignia = ?, 
       WHERE id_categoria = ?`,
      [
        datosActualizar.nombre_categoria,
        datosActualizar.img_categoria,
        datosActualizar.img_public_id,
        datosActualizar.descripcion_categoria,
        datosActualizar.insignia,
        id
      ]
    );

    // 6. Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: {
        id_categoria: id,
        nombre_categoria: datosActualizar.nombre_categoria,
        img_categoria: datosActualizar.img_categoria,
        descripcion_categoria: datosActualizar.descripcion_categoria,
        insignia: datosActualizar.insignia,
        imagen_actualizada: !!req.file,
        public_id: datosActualizar.img_public_id
      }
    });

  } catch (error) {
    console.error("ERROR en actualizarCategoria:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Manejo específico de errores
    let statusCode = 500;
    let errorMessage = "Error del servidor";

    if (error.message.includes("File size too large")) {
      statusCode = 413;
      errorMessage = "La imagen es demasiado grande";
    } else if (error.message.includes("Invalid image")) {
      statusCode = 400;
      errorMessage = "Imagen no válida";
    } else if (error.message.includes("Cloudinary")) {
      errorMessage = "Error al procesar la imagen";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}


async function obtenerCategorias(req, res) {
  const { id } = req.params;

  console.log(" ID recibido:", id);

  try {
    const datosCategoria = await categoriasModel.obtenerCategorias(id);

    res.status(200).json(datosCategoria);
  } catch (err) {
    console.error("❌ Error backend:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
}
module.exports = { registrarCategoria,actualizarCategoria,obtenerCategorias};
