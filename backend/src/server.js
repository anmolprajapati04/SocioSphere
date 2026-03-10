const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    // Seed minimal roles and a default society for local dev
    const defaultRoles = [
      'SUPER_ADMIN',
      'SOCIETY_ADMIN',
      'RESIDENT',
      'SECURITY_GUARD',
      'ACCOUNTANT',
    ];
    for (const name of defaultRoles) {
      // eslint-disable-next-line no-await-in-loop
      await db.Role.findOrCreate({ where: { name }, defaults: { name } });
    }
    await db.Society.findOrCreate({
      where: { name: 'Skyline Heights' },
      defaults: { name: 'Skyline Heights', address: 'Demo Address' },
    });
    await db.Group.findOrCreate({
      where: { society_id: 1, name: 'Society Announcements' },
      defaults: { society_id: 1, name: 'Society Announcements', type: 'SOCIETY' },
    });

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    io.on('connection', (socket) => {
      // visitor_request event
      socket.on('visitor_request', (payload) => {
        io.emit('visitor_request', payload);
      });

      socket.on('visitor_approved', (payload) => {
        io.emit('visitor_approved', payload);
      });

      socket.on('complaint_update', (payload) => {
        io.emit('complaint_update', payload);
      });

      socket.on('emergency_alert', (payload) => {
        io.emit('emergency_alert', payload);
      });

      socket.on('chat_message', (payload) => {
        io.emit('chat_message', payload);
      });
    });

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

