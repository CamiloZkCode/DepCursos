const db = require("../config/db.config");
const Cursos= require("../models/cursos.models");
const { uploadResultCursos } = require("../utils/cloudinary/cursosCloudinary");
const { cloudinary } = require("../config/cloudinary.config");


async function crearCurso(req,res) {
    const {titulo_curso,descripcion,precio,id_categoria,id_dificultad,id_instructor,estatus}=req.body;
    
    try{
    // Validar que los campos obligatorios estén presentes

    if (!titulo_curso || !descripcion|| !precio|| !id_categoria|| !id_dificultad|| !id_instructor|| !estatus) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Verificar si se subió una imagen
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen del curso es requerida' });
    }

    const [existing] = await db.query(
      'SELECT * FROM Cursos WHERE titulo_curso = ?',
      [titulo_curso]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El curso ya existe' });
    }

    const uploadResult = await uploadResultCursos(req.file.buffer, titulo_curso);

    // Insertar el nuevo usuario
    const [result] = await db.query(
      `INSERT INTO Cursos (titulo_curso, descripcion,precio,img_portada,img_public_id,id_categoria,id_dificultad, id_instructor,estatus )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo_curso, descripcion,precio,uploadResult.secure_url,uploadResult.public_id,id_categoria,id_dificultad, id_instructor,estatus|| null]
    );

     res.status(201).json({
      success: true,
      message: 'Curso Registrado Correctamente',
      data: {
        id_curso: result.insertId,
        titulo_curso,
        descripcion,
        precio,
        img_portada: uploadResult.secure_url,
        img_public_id: uploadResult.public_id,
        id_categoria,
        id_dificultad,
        id_instructor,
        estatus
      }
    });

    }catch(err){
        console.error(err);
        res.status(500).json({
          message:"Error del Servidor",
          success: false,
          error: err.message
        });
    }
}

// Actualizar cursi (simplificado)
async function actualizarCurso(req, res) {
  const { id } = req.params;
  const { titulo_curso,descripcion,precio,id_categoria,id_dificultad,id_instructor,estatus } = req.body;

  try {
    // 1. Validar que la categoría existe
    const [cursoExistente] = await db.query(
      `SELECT * FROM Cursos WHERE id_curso = ?`,
      [id]
    );

    if (cursoExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrada"
      });
    }

    const curso = categoriaExistente[0];
    let nuevaImagenUrl = curso.img_portada;
    let nuevoPublicId = curso.img_public_id;
    let uploadResult = null;

    // 2. Si se envió una nueva imagen, procesarla
    if (req.file) {
      // Subir nueva imagen
      uploadResult = await uploadResultCursos(req.file.buffer, titulo_curso || curso.titulo_curso);


      nuevaImagenUrl = uploadResult.secure_url;
      nuevoPublicId = uploadResult.public_id;

      // Eliminar imagen anterior si existe
      if (curso.img_public_id) {
        try {
          await cloudinary.uploader.destroy(curso.img_public_id);
        } catch (deleteError) {
          console.warn("No se pudo eliminar imagen anterior:", deleteError.message);
        }
      }
    }

    // 3. Si se cambia el nombre, verificar que no exista otra con ese nombre
    if (titulo_curso && titulo_curso !== curso.titulo_curso) {
      const [CursoConMismoNombre] = await db.query(
        `SELECT id_curso FROM Cursos 
         WHERE titulo_curso = ? AND id_curso != ?`,
        [titulo_curso, id]
      );

      if (CursoConMismoNombre.length > 0) {
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
          message: "Ya existe un curso con ese nombre"
        });
      }
    }

    // 4. Actualizar en base de datos
    await db.query(
      `UPDATE Cursos
       SET titulo_curso = ?, 
           descripcion = ?,
           precio = ?,
           img_portada = ?,
           img_public_id = ?,
           id_categoria = ?,
           id_dificultad = ?,
           id_instructor = ?,
           estatus = ?
       WHERE id_curso = ?`,
      [
        titulo_curso || curso.titulo_curso,
        descripcion || curso.descripcion,
        precio || curso.precio,
        nuevaImagenUrl,
        nuevoPublicId,
        id_categoria || curso.id_categoria,
        id_dificultad || curso.id_dificultad,
        id_instructor || curso.id_instructor,
        estatus || curso.estatus,
        id
      ]
    );

    // 5. Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Curso actualizado correctamente",
      data: {
        id_curso: id,
        titulo_curso: titulo_curso || curso.titulo_curso,
        descripcion: descripcion || curso.descripcion,
        precio: precio || curso.precio,
        img_portada: nuevaImagenUrl,
        id_categoria: id_categoria || curso.id_categoria,
        id_dificultad: id_dificultad || curso.id_dificultad,
        id_instructor: id_instructor || curso.id_instructor,
        estatus: estatus || curso.estatus,
        imagen_actualizada: !!req.file
      }
    });

  } catch (error) {
    console.error("ERROR en actualizarCurso:", error);
    
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
}


// Obtener todas las categorías (corregido)
async function obtenerCursos(req, res) {
  try {
    const cursos = await Cursos.obtenerCursos();

    res.status(200).json({
      success: true,
      data: cursos
    });
  } catch (err) {
    console.error("Error al obtener cursos:", err);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener cursos"
    });
  }
}

module.exports={crearCurso,actualizarCurso,obtenerCursos}