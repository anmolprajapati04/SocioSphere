module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      entity: { type: DataTypes.STRING },
      entity_id: { type: DataTypes.INTEGER },
      metadata: { type: DataTypes.JSON },
    },
    {
      tableName: 'audit_logs',
      timestamps: true,
    }
  );
  return AuditLog;
};

