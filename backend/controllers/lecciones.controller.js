const db = require("../config/db.config");
const Lecciones= require("../models/lecciones.models");


async function crearLecciones(req,res) {
    const {id_modulo,titulo, tipo,contenido_texto,orden} =req.body;

    try{
        if (!id_curso||!titulo|| !orden ) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        //Verificar que el curso exista
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
            
        //Verificar que no exista el modulo
        const [existing] = await db.query(
            'SELECT * FROM Modulos WHERE titulo = ? AND id_curso  = ?',
            [titulo,id_curso]
        );
        if (existing.length > 0) {
        return res.status(400).json({ message: 'El modulo ya existe en el curso' });
        }


        const [result] = await db.query(
        `INSERT into Modulos (id_curso,titulo,orden) VALUES (?,?,?)` ,
        [id_curso,titulo,orden]
        );

        res.status(201).json({
        success: true,
        message: 'Modulo Registrado Correctamente',
        data: {
          id_modulo: result.insertId,
          id_curso,
          titulo,
          orden,
        }
      });

    }catch(err){
      res.status(500).json({
      message:"Error del Servidor",
        success: false,
        error: err.message
      })
    }
}

async function actualizarModulo(req,res) {
  const { id } = req.params;
  const {titulo, orden} =req.body;

    try{

        if (!titulo|| !orden ) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        //Validar que el modulo existe
        const [moduloExistente] = await db.query(
          `SELECT * FROM Modulos WHERE id_modulo= ? `,
          [id]
        );

        if (moduloExistente.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Modulo en el curso No Existe"
          });
        }

        const modulo = moduloExistente[0];


        const [ModuloConMismoNombre] = await db.query(
            `SELECT id_modulo FROM Modulos
            WHERE titulo = ? AND id_modulo != ?`,
            [titulo, id]
          );

          if (ModuloConMismoNombre.length > 0) {
            return res.status(400).json({
              success: false,
              message: "Ya existe un modulo con ese nombre"
            });
          }

        const [result] = await db.query(
        `UPDATE MODULOS
         SET titulo = ?,
         orden = ?` ,
        [
          titulo || modulo.titulo ,
          orden  || modulo.orden
        ]
        );

        res.status(201).json({
        success: true,
        message: 'Modulo Registrado Correctamente',
        data: {
          id_modulo: result.insertId,
          titulo:titulo || modulo.titulo ,
          orden: orden  || orden.titulo  
        }
      });

    }catch(err){
      res.status(500).json({
      message:"Error del Servidor",
        success: false,
        error: err.message
      })
    }
}

async function obtenerModulosByCurso(req,res) {
  const {id_curso}=req.params
  try {
      const modulos = await Modulos.obtenerModulosByCurso(id_curso);

      res.status(200).json({
        success: true,
        data: modulos
      });
    } catch (err) {
      console.error("Error al obtener modulo del curso:", err);
      res.status(500).json({
        success: false,
        message: "Error del servidor al obtener modulo del curso"
      });
    }
}


module.exports={crearModulo,actualizarModulo,obtenerModulosByCurso}

