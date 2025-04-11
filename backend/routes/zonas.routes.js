// routes/zonas.routes.js
const express = require('express');
const router = express.Router();
const zonasController = require('../controllers/zonas.controller');
const { verifyToken, isInstructor } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', zonasController.getAll);
router.get('/:id', zonasController.getById);

// Rutas protegidas
router.post('/', verifyToken, isInstructor, zonasController.create);
router.put('/:id', verifyToken, isInstructor, zonasController.update);
router.delete('/:id', verifyToken, isInstructor, zonasController.delete);

module.exports = router;
