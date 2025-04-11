// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Rutas protegidas
router.get('/me', verifyToken, authController.me);

module.exports = router;
