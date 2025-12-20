

async function crearCurso(req,res) {
    const {id_curso,titulo_curso,descripcion,precio,img_portada,id_categoria,id_dificultad,id_instructor,estatus}=req.body;
    

    try{
    // Validar que los campos obligatorios estén presentes

    if (!titulo_curso || !descripcion|| !precio|| !id_categoria|| !id_dificultad|| !id_instructor|| !estatus) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const [existing] = await db.query(
      'SELECT * FROM Cursos WHERE titulo_curso = ?',
      [titulo_curso]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El curso ya existe' });
    }

    // Insertar el nuevo usuario
    await db.query(
      `INSERT INTO Cursos (titulo_curso, descripcion,precio,img_portada,id_categoria,id_dificultad, id_instructor,estatus )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo_curso, descripcion,precio,img_portada,id_categoria,id_dificultad, id_instructor,estatus|| null]
    );

    }catch(err){
        console.error(err);
        res.status(500).json({message:"Error del Servidor"})

    }
}


module.exports={crearCurso}