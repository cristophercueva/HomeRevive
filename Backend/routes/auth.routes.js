const express = require('express');
const authController = require('../controllers/auth.controller.js');
const { login, logout,verifyToken } = authController;


const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyToken);


module.exports = router;
