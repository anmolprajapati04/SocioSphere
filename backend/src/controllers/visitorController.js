const db = require('../models');

/**
 * Create a new visitor pre-authorization (Resident)
 */
exports.createVisitor = async (req, res, next) => {
  try {
    const visitor_name = req.body.visitor_name || req.body.name;
    const resident_id = (req.user.role === 'Security' || req.user.role === 'Admin') 
      ? req.body.resident_id 
      : req.user.id;
    
    const initialStatus = req.user.role === 'Security' ? 'IN' : 'PENDING';

    const visitor = await db.Visitor.create({
      visitor_name,
      phone: req.body.phone,
      purpose: req.body.purpose,
      resident_id,
      status: initialStatus
    });

    const io = req.app.get('io');
    if (io) {
      console.log(`Emitting visitor_request to society_${req.user.society_id}`);
      io.to(`society_${req.user.society_id}`).emit('visitor_request', { 
        ...visitor.toJSON(), 
        resident_name: req.user.name 
      });
      io.to(`society_${req.user.society_id}`).emit('new_visitor', visitor);
    }
    res.status(201).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all visitors (Filtered by role)
 */
exports.getAllVisitors = async (req, res, next) => {
  try {
    const where = {};
    
    // Residents only see their own visitors
    if (req.user.role === 'Resident') {
      where.resident_id = req.user.id;
    }
    
    // Admin and Security see all visitors in the society
    // (Assuming resident_id belongs to a user in the same society)
    const visitors = await db.Visitor.findAll({
      where,
      include: [
        {
          model: db.User,
          as: 'Resident',
          attributes: ['name', 'flat_number'],
          where: { society_id: req.user.society_id }
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: visitors
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update visitor status (Check-in/Check-out for Security/Admin)
 */
exports.updateVisitorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const visitor = await db.Visitor.findByPk(id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    const updateData = { status };
    if (status === 'IN' || status === 'APPROVED') {
      updateData.entry_time = new Date();
    } else if (status === 'OUT' || status === 'REJECTED') {
      updateData.exit_time = new Date();
    }

    await visitor.update(updateData);

    const io = req.app.get('io');
    if (io) {
      const eventName = status === 'IN' ? 'visitor_entry' : status === 'OUT' ? 'visitor_exit' : 'visitor_status_update';
      console.log(`Emitting ${eventName} to society_${req.user.society_id}`);
      io.to(`society_${req.user.society_id}`).emit(eventName, visitor);
      io.to(`society_${req.user.society_id}`).emit('visitor_status_update', visitor);
    }

    res.json({
      success: true,
      data: visitor
    });
  } catch (err) {
    next(err);
  }
};
