module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      flat_number: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      refresh_token: { type: DataTypes.STRING },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );
  return User;
};

