require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const amenityRoutes = require('./routes/amenityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const residentRoutes = require('./routes/residentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

module.exports = app;

