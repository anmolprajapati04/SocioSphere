const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Society = require('./society')(sequelize, Sequelize.DataTypes);
db.Role = require('./role')(sequelize, Sequelize.DataTypes);
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.MaintenancePlan = require('./maintenancePlan')(sequelize, Sequelize.DataTypes);
db.MaintenancePayment = require('./maintenancePayment')(sequelize, Sequelize.DataTypes);
db.Complaint = require('./complaint')(sequelize, Sequelize.DataTypes);
db.Visitor = require('./visitor')(sequelize, Sequelize.DataTypes);
db.Notice = require('./notice')(sequelize, Sequelize.DataTypes);
db.Amenity = require('./amenity')(sequelize, Sequelize.DataTypes);
db.AmenityBooking = require('./amenityBooking')(sequelize, Sequelize.DataTypes);
db.Notification = require('./notification')(sequelize, Sequelize.DataTypes);
db.AuditLog = require('./auditLog')(sequelize, Sequelize.DataTypes);
db.Resident = require('./resident')(sequelize, Sequelize.DataTypes);
db.Group = require('./group')(sequelize, Sequelize.DataTypes);
db.Message = require('./message')(sequelize, Sequelize.DataTypes);

db.Society.hasMany(db.User, { foreignKey: 'society_id' });
db.User.belongsTo(db.Society, { foreignKey: 'society_id' });

db.Role.hasMany(db.User, { foreignKey: 'role_id' });
db.User.belongsTo(db.Role, { foreignKey: 'role_id' });

db.Society.hasMany(db.MaintenancePlan, { foreignKey: 'society_id' });
db.MaintenancePlan.belongsTo(db.Society, { foreignKey: 'society_id' });

db.MaintenancePlan.hasMany(db.MaintenancePayment, { foreignKey: 'plan_id' });
db.MaintenancePayment.belongsTo(db.MaintenancePlan, { foreignKey: 'plan_id' });
db.User.hasMany(db.MaintenancePayment, { foreignKey: 'user_id' });
db.MaintenancePayment.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.Complaint, { foreignKey: 'society_id' });
db.Complaint.belongsTo(db.Society, { foreignKey: 'society_id' });
db.User.hasMany(db.Complaint, { foreignKey: 'user_id' });
db.Complaint.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.Visitor, { foreignKey: 'society_id' });
db.Visitor.belongsTo(db.Society, { foreignKey: 'society_id' });
db.User.hasMany(db.Visitor, { foreignKey: 'resident_id' });
db.Visitor.belongsTo(db.User, { foreignKey: 'resident_id' });

db.Society.hasMany(db.Notice, { foreignKey: 'society_id' });
db.Notice.belongsTo(db.Society, { foreignKey: 'society_id' });

db.Society.hasMany(db.Amenity, { foreignKey: 'society_id' });
db.Amenity.belongsTo(db.Society, { foreignKey: 'society_id' });
db.Amenity.hasMany(db.AmenityBooking, { foreignKey: 'amenity_id' });
db.AmenityBooking.belongsTo(db.Amenity, { foreignKey: 'amenity_id' });
db.User.hasMany(db.AmenityBooking, { foreignKey: 'user_id' });
db.AmenityBooking.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.Notification, { foreignKey: 'society_id' });
db.Notification.belongsTo(db.Society, { foreignKey: 'society_id' });
db.User.hasMany(db.Notification, { foreignKey: 'user_id' });
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.AuditLog, { foreignKey: 'society_id' });
db.AuditLog.belongsTo(db.Society, { foreignKey: 'society_id' });
db.User.hasMany(db.AuditLog, { foreignKey: 'user_id' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.Resident, { foreignKey: 'society_id' });
db.Resident.belongsTo(db.Society, { foreignKey: 'society_id' });
db.User.hasOne(db.Resident, { foreignKey: 'user_id' });
db.Resident.belongsTo(db.User, { foreignKey: 'user_id' });

db.Society.hasMany(db.Group, { foreignKey: 'society_id' });
db.Group.belongsTo(db.Society, { foreignKey: 'society_id' });

db.Society.hasMany(db.Message, { foreignKey: 'society_id' });
db.Message.belongsTo(db.Society, { foreignKey: 'society_id' });
db.Group.hasMany(db.Message, { foreignKey: 'group_id' });
db.Message.belongsTo(db.Group, { foreignKey: 'group_id' });
db.User.hasMany(db.Message, { foreignKey: 'sender_id' });
db.Message.belongsTo(db.User, { foreignKey: 'sender_id', as: 'Sender' });

module.exports = db;

