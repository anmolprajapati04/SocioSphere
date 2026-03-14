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

    // Make socket available in controllers via app settings
    app.set("io", io);

    /* ---------- Socket Events ---------- */

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join_society", (societyId) => {
        if (societyId) {
          socket.join(`society_${societyId}`);
          console.log(`Socket ${socket.id} joined society_${societyId}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // Legacy listeners (optional if moving to controller-based emits)
      socket.on("emergency_alert", (payload) => {
        if (payload.society_id) {
          io.to(`society_${payload.society_id}`).emit("emergency_alert", payload);
        } else {
          io.emit("emergency_alert", payload);
        }
      });

      socket.on("chat_message", (payload) => {
        if (payload.society_id) {
          io.to(`society_${payload.society_id}`).emit("chat_message", payload);
        } else {
          io.emit("chat_message", payload);
        }
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