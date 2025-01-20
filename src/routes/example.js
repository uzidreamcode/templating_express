'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/karyawanController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/tambah_user', verifyToken, controller.createExample);
router.get('/budi', verifyToken,controller.getAllExample);
router.get('/cek/:id', verifyToken, controller.getExampleById);
router.put('/update/:id',verifyToken, controller.updateExample);
router.delete('/delete/:id',verifyToken, controller.deleteExample);

module.exports = router;