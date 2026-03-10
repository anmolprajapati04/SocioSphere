module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define(
    'Visitor',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      resident_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      purpose: { type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'IN', 'OUT'),
        defaultValue: 'PENDING',
      },
      check_in: { type: DataTypes.DATE },
      check_out: { type: DataTypes.DATE },
    },
    {
      tableName: 'visitors',
      timestamps: true,
    }
  );
  return Visitor;
};

