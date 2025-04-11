// controllers/zonas.controller.js
const { pool } = require('../config/db');

// Obtener todas las zonas
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT z.*, u.nombre as creador 
      FROM zonas z 
      LEFT JOIN usuarios u ON z.creado_por = u.id
      ORDER BY z.id DESC
    `);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una zona por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
      SELECT z.*, u.nombre as creador 
      FROM zonas z 
      LEFT JOIN usuarios u ON z.creado_por = u.id
      WHERE z.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva zona
exports.create = async (req, res) => {
  try {
    const { nombre, ubicacion, altitud, descripcion, imagen_url, estado } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO zonas (nombre, ubicacion, altitud, descripcion, imagen_url, estado, creado_por) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, ubicacion, altitud, descripcion, imagen_url, estado || true, req.userId]
    );
    
    res.status(201).json({
      message: 'Zona creada exitosamente',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una zona
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, altitud, descripcion, imagen_url, estado } = req.body;
    
    // Verificar si la zona existe
    const [existingZona] = await pool.query('SELECT * FROM zonas WHERE id = ?', [id]);
    if (existingZona.length === 0) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }
    
    await pool.query(
      'UPDATE zonas SET nombre = ?, ubicacion = ?, altitud = ?, descripcion = ?, imagen_url = ?, estado = ? WHERE id = ?',
      [nombre, ubicacion, altitud, descripcion, imagen_url, estado, id]
    );
    
    res.json({ message: 'Zona actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una zona
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la zona existe
    const [existingZona] = await pool.query('SELECT * FROM zonas WHERE id = ?', [id]);
    if (existingZona.length === 0) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }
    
    // Verificar si hay reservas asociadas
    const [reservas] = await pool.query('SELECT * FROM reservas WHERE zona_id = ?', [id]);
    if (reservas.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar la zona porque tiene reservas asociadas' 
      });
    }
    
    await pool.query('DELETE FROM zonas WHERE id = ?', [id]);
    
    res.json({ message: 'Zona eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
