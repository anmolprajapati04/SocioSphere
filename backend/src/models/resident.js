module.exports = (sequelize, DataTypes) => {
  const Resident = sequelize.define(
    'Resident',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      flat_number: { type: DataTypes.STRING, allowNull: false },
      wing: { type: DataTypes.STRING },
      is_owner: { type: DataTypes.BOOLEAN, defaultValue: false },
      move_in_date: { type: DataTypes.DATEONLY },
    },
    {
      tableName: 'residents',
      timestamps: true,
    }
  );
  return Resident;
};

