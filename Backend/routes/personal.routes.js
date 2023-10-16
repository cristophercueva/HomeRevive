const express = require('express');
const {authRequired} = require("../middlewares/validateToken.js");
const { createPersonal, updatePersonal, getPersonal, getPersonals } = require('../controllers/personal.controller.js');


const router = express.Router();

router.get('/personals',authRequired, getPersonals);
router.get('/personals/:id',authRequired, getPersonal);
router.post('/personals',authRequired, createPersonal);
router.put('/personals/:id',authRequired, updatePersonal);

module.exports = router;
