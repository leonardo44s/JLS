// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/zonas', require('./routes/zonas.routes'));
app.use('/api/equipos', require('./routes/equipos.routes'));
app.use('/api/reservas', require('./routes/reservas.routes'));
app.use('/api/saltos', require('./routes/saltos.routes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Paracaidismo Colombia funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
