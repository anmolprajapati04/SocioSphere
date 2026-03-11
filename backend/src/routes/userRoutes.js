const express = require('express');
const { me, listResidents } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, me);
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['Admin']),
  listResidents
);

module.exports = router;

