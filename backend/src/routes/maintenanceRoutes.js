const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

router.get('/plans', authMiddleware, maintenanceController.getPlans);
router.get('/payments', authMiddleware, maintenanceController.getPayments);
router.post('/payments/:id/pay', authMiddleware, maintenanceController.payMaintenance);
router.post('/payments/:id/record', authMiddleware, maintenanceController.recordPayment);

module.exports = router;

