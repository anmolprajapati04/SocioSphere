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

    const [residentsCount, revenueSum, complaintsByStatus, visitorsToday, defaultersCount, totalComplaints] =
      await Promise.all([
        db.Resident ? db.Resident.count({ where: { society_id: societyId } }) : db.User.count({ where: { society_id: societyId, role: 'Resident' } }),
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
            created_at: { [db.Sequelize.Op.between]: [startOfToday, endOfToday] },
          },
        }),
        db.MaintenancePayment.count({
          where: { society_id: societyId, status: 'OVERDUE' },
        }),
        db.Complaint.count({ where: { society_id: societyId } })
      ]);

    res.json({
      success: true,
      data: {
        residentsCount,
        maintenanceRevenue: revenueSum || 0,
        complaintStats: complaintsByStatus,
        visitorAnalytics: { today: visitorsToday },
        paymentDefaulters: defaultersCount,
        totalComplaints,
        society_id: societyId,
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/growth', authMiddleware, async (req, res, next) => {
  try {
    const societyId = req.user.society_id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await db.MaintenancePayment.findAll({
      where: {
        society_id: societyId,
        status: 'PAID',
        created_at: { [db.Sequelize.Op.gte]: sixMonthsAgo }
      },
      attributes: [
        [db.Sequelize.fn('MONTHNAME', db.Sequelize.col('created_at')), 'month'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'total']
      ],
      group: [
        db.Sequelize.fn('MONTHNAME', db.Sequelize.col('created_at')),
        db.Sequelize.fn('MONTH', db.Sequelize.col('created_at'))
      ],
      order: [[db.Sequelize.fn('MONTH', db.Sequelize.col('created_at')), 'ASC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

