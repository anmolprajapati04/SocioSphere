const db = require("../models");

/**
 * Create Complaint
 */
exports.createComplaint = async (req, res, next) => {
  try {
    const complaint = await db.Complaint.create({
      society_id: req.user.society_id,
      resident_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || "LOW",
      status: "PENDING"
    });

    const io = req.app.get('io');
    if (io) {
      console.log(`Emitting new_complaint to society_${req.user.society_id}`);
      io.to(`society_${req.user.society_id}`).emit("new_complaint", complaint);
    }

    res.status(201).json({
      success: true,
      data: complaint
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Get Complaints
 */
exports.getAllComplaints = async (req, res, next) => {
  try {
    const where = { society_id: req.user.society_id };

    if (req.user.role === "Resident") {
      where.resident_id = req.user.id;
    }

    const complaints = await db.Complaint.findAll({
      where,

      include: [
        {
          model: db.User,
          as: "User",
          attributes: ["name", "flat_number", "phone", "role"]
        }
      ],

      order: [["created_at", "DESC"]]
    });

    res.json({
      success: true,
      data: complaints
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Update Complaint (Admin)
 */
exports.updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    const allowedStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const complaint = await db.Complaint.findOne({
      where: {
        id,
        society_id: req.user.society_id
      }
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.update({
      status,
      admin_response
    });

    const io = req.app.get('io');
    if (io) {
      console.log(`Emitting complaint_status_update to society_${req.user.society_id}`);
      io.to(`society_${req.user.society_id}`).emit("complaint_status_update", complaint);
    }

    res.json({
      success: true,
      data: complaint
    });

  } catch (err) {
    next(err);
  }
};