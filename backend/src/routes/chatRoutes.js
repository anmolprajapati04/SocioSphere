const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/groups', authMiddleware, chatController.getGroups);
router.get('/messages', authMiddleware, chatController.getGroupMessages);
router.post('/messages', authMiddleware, chatController.sendMessage);

module.exports = router;

module.exports = router;

