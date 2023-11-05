const express = require('express');
const {authRequired} = require("../middlewares/validateToken.js");
const {getCasas,
    getCasa,
    createCasa,
    updateCasa,
    deleteCasa} = require("../controllers/casa.controller.js");

const router = express.Router();

router.get('/casas',authRequired, getCasas);
router.get('/casas/:id',authRequired, getCasa);
router.post('/casas',authRequired, createCasa);
router.put('/casas/:id',authRequired, updateCasa);
router.delete('/casas/:id',authRequired, deleteCasa);

module.exports = router;