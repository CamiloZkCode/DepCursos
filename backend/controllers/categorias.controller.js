const db = require("../config/db");
const categoriasModel= require("../models/categorias.models");


async function registrarCategoria(req,res) {
  const { nombre_categoria, img_categoria ,descripcion_categoria,insignia} = req.body;
  try{
      if (!nombre_categoria || !img_categoria|| !descripcion_categoria|| !insignia) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      // Verificar si la categoria ya existe
      const [existing] = await db.query(
        'SELECT * FROM Categorias WHERE nombre_categoria = ?',
        [nombre_categoria] 
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'La Categoria ya Existe' });
      }

      await db.query(
      `INSERT Categorias (nombre_categoria, img_categoria,descripcion_categoria,insignia)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_categoria, img_categoria,descripcion_categoria,insignia|| null]
    );

    res.status(201).json({ 
      message: 'Categoria Registrada Correctamente',
    });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
    
}



async function actualizarCategoria(params) {
  
}

module.exports = { registrarCategoria};
