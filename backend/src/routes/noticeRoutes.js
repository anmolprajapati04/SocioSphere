const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

router.get('/', authMiddleware, noticeController.getAllNotices);
router.post('/', authMiddleware, noticeController.createNotice);

module.exports = router;

