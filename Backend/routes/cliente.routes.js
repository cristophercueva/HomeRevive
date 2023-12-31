const express = require('express');
const {authRequired} = require("../middlewares/validateToken.js");
const {createCliente, getClientes, getCliente,getLastCliente, updateCliente} = require("../controllers/cliente.controller.js");

const router = express.Router();

router.get('/clientes',authRequired, getClientes);
router.get('/clientes/:id',authRequired, getCliente);
router.get('/cliente',authRequired, getLastCliente);
router.post('/clientes',authRequired, createCliente);
router.put('/clientes/:id',authRequired, updateCliente);

module.exports = router;