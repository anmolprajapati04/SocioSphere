const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Connect to database
    await db.sequelize.authenticate();

    // Sync models (safe mode)
    await db.sequelize.sync();

    /* ---------- Seed initial data ---------- */

    const defaultRoles = [
      "SUPER_ADMIN",
      "SOCIETY_ADMIN",
      "RESIDENT",
      "SECURITY_GUARD",
      "ACCOUNTANT"
    ];

    for (const roleName of defaultRoles) {
      await db.Role.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName }
      });
    }

    const [society] = await db.Society.findOrCreate({
      where: { name: "Skyline Heights" },
      defaults: {
        name: "Skyline Heights",
        address: "Demo Address",
        city: "Mumbai"
      }
    });

    await db.Group.findOrCreate({
      where: {
        society_id: society.id,
        name: "Society Announcements"
      },
      defaults: {
        society_id: society.id,
        name: "Society Announcements",
        type: "SOCIETY"
      }
    });

    /* ---------- Create HTTP + Socket server ---------- */

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Make socket available in controllers
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    /* ---------- Socket Events ---------- */

    io.on("connection", (socket) => {

      socket.on("visitor_request", (payload) => {
        io.emit("visitor_request", payload);
      });

      socket.on("visitor_approved", (payload) => {
        io.emit("visitor_approved", payload);
      });

      socket.on("complaint_update", (payload) => {
        io.emit("complaint_update", payload);
      });

      socket.on("emergency_alert", (payload) => {
        io.emit("emergency_alert", payload);
      });

      socket.on("chat_message", (payload) => {
        io.emit("chat_message", payload);
      });

    });

    /* ---------- Start server ---------- */

    server.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();