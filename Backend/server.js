const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');



const { connectDB } = require('./db.js');
const corsOptions = {
    origin: 'http://localhost:5173',  // Dirección de tu frontend
    credentials: true  // Esto permite que el servidor acepte cookies y encabezados de autenticación
};
//connect to express app
const app = express();

//connect to MongoDB
connectDB();
//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//routes
const authRoutes = require("./routes/auth.routes.js");
const clienteRoutes = require("./routes/cliente.routes.js");
const trabajadorRoutes = require("./routes/trabajador.route.js");

app.use("/api", authRoutes);
app.use("/api", clienteRoutes);
app.use("/api", trabajadorRoutes);




module.exports = app;