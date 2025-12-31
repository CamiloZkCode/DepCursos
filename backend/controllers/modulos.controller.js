const db = require("../config/db.config");
const Modulos= require("../models/modulos.models");


async function crearModulo(req,res) {
    const {id_curso,titulo, orden} =req.body;

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
      }

      )

    }
    
}


async function actualizarModulo(req,res) {
  const {id_curso,titulo, orden} =req.body;

    try
    {
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

async function obtenerModulosByCurso(req,res) {
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



module.exports={crearModulo,actualizarModulo,obtenerModulosByCurso}

