module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define(
    'Visitor',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      visitor_name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      resident_id: { type: DataTypes.INTEGER, allowNull: false },
      entry_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      exit_time: { type: DataTypes.DATE },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'IN', 'OUT'),
        defaultValue: 'PENDING',
      },
    },
    {
      tableName: 'visitors',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Visitor;
};

