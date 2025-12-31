const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("dotenv").config();




//import rutas
const authRoutes = require("./routes/auth.routes");
const usuarioRoutes =require("./routes/usuario.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const dificultadRoutes = require("./routes/dificultad.routes");
const cursosRoutes = require ("./routes/cursos.routes");
const modulosRoutes = require("./routes/modulos.routes");


const app = express();

// Configuración CORS para cookies
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // IMPORTANTE: Permite enviar cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Para leer cookies

//url de endpoint
app.use("/api/auth", authRoutes);
app.use("/api/usuario",usuarioRoutes);
app.use("/api/categorias",categoriasRoutes);
app.use("/api/dificultad",dificultadRoutes);
app.use("/api/cursos",cursosRoutes)
app.use("/api/modulos",modulosRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});