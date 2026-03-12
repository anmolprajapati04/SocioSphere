const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const visitorController = require('../controllers/visitorController');

const router = express.Router();

router.get('/', authMiddleware, visitorController.getAllVisitors);
router.post('/', authMiddleware, visitorController.createVisitor);
router.put('/:id', authMiddleware, visitorController.updateVisitorStatus);

module.exports = router;

