module.exports = (sequelize, DataTypes) => {
  const MaintenancePayment = sequelize.define(
    'MaintenancePayment',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      resident_id: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: { type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'), defaultValue: 'PENDING' },
      payment_date: { type: DataTypes.DATE },
    },
    {
      tableName: 'maintenance',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return MaintenancePayment;
};

