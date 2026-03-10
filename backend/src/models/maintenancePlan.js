module.exports = (sequelize, DataTypes) => {
  const MaintenancePlan = sequelize.define(
    'MaintenancePlan',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      frequency: { type: DataTypes.ENUM('MONTHLY', 'QUARTERLY', 'YEARLY'), allowNull: false },
      due_day: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'maintenance_plans',
      timestamps: true,
    }
  );
  return MaintenancePlan;
};

