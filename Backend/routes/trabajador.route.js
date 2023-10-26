const express = require('express');
const {authRequired} = require("../middlewares/validateToken.js");
const {getTrabajadores, createTrabajador, getTrabajador, updateTrabajador}= require ("../controllers/trabajador.controller.js");

const router = express.Router();

router.get('/trabajadores',authRequired, getTrabajadores);
router.get('/trabajadores/:id',authRequired, getTrabajador);
router.post('/trabajadores',authRequired, createTrabajador);
router.put('/trabajadores/:id',authRequired, updateTrabajador);

module.exports = router;