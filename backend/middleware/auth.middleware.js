// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    // Eliminar "Bearer " si está presente
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Verificar el token
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
const isAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.id = ?',
      [req.userId]
    );

    if (rows.length > 0 && rows[0].nombre === 'administrador') {
      next();
    } else {
      return res.status(403).json({ message: 'Requiere rol de administrador' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.id = ?',
      [req.userId]
    );

    if (rows.length > 0 && (rows[0].nombre === 'instructor' || rows[0].nombre === 'administrador')) {
      next();
    } else {
      return res.status(403).json({ message: 'Requiere rol de instructor o administrador' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isInstructor
};
