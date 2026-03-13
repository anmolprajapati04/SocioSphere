const db = require('../models');

/**
 * Get maintenance payments (Filtered by role)
 */
exports.getPayments = async (req, res, next) => {
  try {
    const where = {};
    
    // Residents only see their own payments
    if (req.user.role === 'Resident') {
      where.resident_id = req.user.id;
    } else {
      // Admin/Security might need to filter by society
      // This assumes a query for a specific resident or all in society
      if (req.query.resident_id) {
        where.resident_id = req.query.resident_id;
      }
    }
    
    const payments = await db.MaintenancePayment.findAll({
      where,
      include: [
        {
          model: db.User,
          as: 'Resident',
          attributes: ['name', 'flat_number', 'phone'],
          where: { society_id: req.user.society_id }
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

/**
 * Get utility usage mock data (LPG, Water, Electricity)
 */
exports.getUtilityUsage = async (req, res, next) => {
  try {
    // Providing a richer set of monthly data for the report
    const months = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
    const usage = months.map(month => ({
      month,
      electricity: Math.floor(Math.random() * (250 - 100) + 100),
      water: Math.floor(Math.random() * (150 - 50) + 50),
      lpg: Math.floor(Math.random() * (60 - 20) + 20)
    }));
    
    res.json(usage);
  } catch (err) {
    next(err);
  }
};

/**
 * Resident initiated payment (Mock success)
 */
exports.payMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await db.MaintenancePayment.findOne({
      where: { id, resident_id: req.user.id }
    });
    
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    if (payment.status === 'PAID') return res.status(400).json({ message: 'Bill already paid' });

    // Mock payment gateway success
    await payment.update({
      status: 'PAID',
      payment_date: new Date(),
      transaction_id: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });

    res.json({ 
      message: `Payment successful! A confirmation receipt has been sent to ${req.user.email}`, 
      payment 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin records a payment manually
 */
exports.recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const payment = await db.MaintenancePayment.findByPk(id);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    await payment.update({
      status: 'PAID',
      payment_date: req.body.payment_date || new Date(),
      remarks: req.body.remarks || 'Manually recorded'
    });

    res.json({ message: 'Payment recorded successfully', payment });
  } catch (err) {
    next(err);
  }
};

/**
 * Get available maintenance plans for the society
 */
exports.getPlans = async (req, res, next) => {
  try {
    const plans = await db.MaintenancePlan.findAll({
      where: { society_id: req.user.society_id }
    });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};
