const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const societyId = req.user.society_id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [residentsCount, revenueSum, complaintsByStatus, visitorsToday, defaultersCount] =
      await Promise.all([
        db.Resident ? db.Resident.count({ where: { society_id: societyId } }) : db.User.count({ where: { society_id: societyId } }),
        db.MaintenancePayment.sum('amount', {
          where: { society_id: societyId, status: 'PAID' },
        }),
        db.Complaint.findAll({
          where: { society_id: societyId },
          attributes: ['status', [db.Sequelize.fn('COUNT', '*'), 'count']],
          group: ['status'],
        }),
        db.Visitor.count({
          where: {
            society_id: societyId,
            createdAt: { [db.Sequelize.Op.between]: [startOfToday, endOfToday] },
          },
        }),
        db.MaintenancePayment.count({
          where: { society_id: societyId, status: 'OVERDUE' },
        }),
      ]);

    res.json({
      residentsCount,
      maintenanceRevenue: revenueSum || 0,
      complaintStats: complaintsByStatus,
      visitorAnalytics: { today: visitorsToday },
      paymentDefaulters: defaultersCount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

