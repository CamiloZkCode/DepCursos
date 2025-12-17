const express = require("express");
const cors = require("cors");


require("dotenv").config();

//import rutas
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

//url de endpoint
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});