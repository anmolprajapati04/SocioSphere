module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { 
        type: DataTypes.ENUM('Admin', 'Resident', 'Security'), 
        allowNull: false,
        defaultValue: 'Resident'
      },
      society_id: { type: DataTypes.INTEGER, allowNull: true },
      flat_number: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return User;
};

