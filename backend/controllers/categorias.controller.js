// controllers/categorias.controller.js
const db = require("../config/db.config");
const Categoria = require("../models/categorias.models");
const { uploadToCloudinary, cloudinary } = require("../config/cloudinary.config");

// Obtener todas las categorías
async function obtenerCategorias(req, res) {
  try {
    const categorias = await Categoria.obtenerCategoria();

    res.status(200).json({
      success: true,
      data: categorias
    });
  } catch (err) {
    console.error("Error al obtener categorías:", err);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener categorías"
    });
  }
}

// Crear nueva categoría (ya lo tienes bien)
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

    // Subir imagen a Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: "lms/categorias",
      public_id: `cat_${Date.now()}_${nombre_categoria.toLowerCase().replace(/\s+/g, '_')}`,
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    // Insertar en la base de datos
    const [result] = await db.query(
      `INSERT INTO Categorias (nombre_categoria, img_categoria, descripcion_categoria, insignia, img_public_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre_categoria,
        uploadResult.secure_url,
        descripcion_categoria,
        insignia,
        uploadResult.public_id
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Categoría Registrada Correctamente',
      data: {
        id_categoria: result.insertId,
        nombre_categoria,
        img_categoria: uploadResult.secure_url,
        img_public_id: uploadResult.public_id,
        descripcion_categoria,
        insignia
      }
    });
  } catch (err) {
    console.error('Error al registrar categoría:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor',
      error: err.message 
    });
  }
}

// Actualizar categoría (simplificado)
async function actualizarCategoria(req, res) {
  const { id } = req.params;
  const { nombre_categoria, descripcion_categoria, insignia } = req.body;

  try {
    // 1. Validar que la categoría existe
    const [categoriaExistente] = await db.query(
      `SELECT * FROM Categorias WHERE id_categoria = ?`,
      [id]
    );

    if (categoriaExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    const categoria = categoriaExistente[0];
    let nuevaImagenUrl = categoria.img_categoria;
    let nuevoPublicId = categoria.img_public_id;
    let uploadResult = null;

    // 2. Si se envió una nueva imagen, procesarla
    if (req.file) {
      // Subir nueva imagen
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

      // Eliminar imagen anterior si existe
      if (categoria.img_public_id) {
        try {
          await cloudinary.uploader.destroy(categoria.img_public_id);
        } catch (deleteError) {
          console.warn("No se pudo eliminar imagen anterior:", deleteError.message);
        }
      }
    }

    // 3. Si se cambia el nombre, verificar que no exista otra con ese nombre
    if (nombre_categoria && nombre_categoria !== categoria.nombre_categoria) {
      const [categoriaConMismoNombre] = await db.query(
        `SELECT id_categoria FROM Categorias 
         WHERE nombre_categoria = ? AND id_categoria != ?`,
        [nombre_categoria, id]
      );

      if (categoriaConMismoNombre.length > 0) {
        // Revertir imagen si se subió una nueva
        if (uploadResult) {
          try {
            await cloudinary.uploader.destroy(uploadResult.public_id);
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

    // 4. Actualizar en base de datos
    await db.query(
      `UPDATE Categorias 
       SET nombre_categoria = ?, 
           img_categoria = ?, 
           img_public_id = ?,
           descripcion_categoria = ?, 
           insignia = ?
       WHERE id_categoria = ?`,
      [
        nombre_categoria || categoria.nombre_categoria,
        nuevaImagenUrl,
        nuevoPublicId,
        descripcion_categoria || categoria.descripcion_categoria,
        insignia || categoria.insignia,
        id
      ]
    );

    // 5. Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: {
        id_categoria: id,
        nombre_categoria: nombre_categoria || categoria.nombre_categoria,
        img_categoria: nuevaImagenUrl,
        descripcion_categoria: descripcion_categoria || categoria.descripcion_categoria,
        insignia: insignia || categoria.insignia,
        imagen_actualizada: !!req.file
      }
    });

  } catch (error) {
    console.error("ERROR en actualizarCategoria:", error);
    
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
}

module.exports = { 
  obtenerCategorias,
  registrarCategoria, 
  actualizarCategoria 
};