module.exports = (sequelize, DataTypes) => {
  const MaintenancePayment = sequelize.define(
    'MaintenancePayment',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      plan_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: { type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'), defaultValue: 'PENDING' },
      due_date: { type: DataTypes.DATEONLY, allowNull: false },
      paid_at: { type: DataTypes.DATE },
      transaction_ref: { type: DataTypes.STRING },
    },
    {
      tableName: 'maintenance_payments',
      timestamps: true,
    }
  );
  return MaintenancePayment;
};

