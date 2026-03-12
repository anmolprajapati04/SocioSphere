const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, complaintController.createComplaint);

router.get("/", authMiddleware, complaintController.getAllComplaints);

router.put("/:id", authMiddleware, complaintController.updateComplaint);

module.exports = router;