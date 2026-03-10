module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define(
    'Amenity',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: 'amenities',
      timestamps: true,
    }
  );
  return Amenity;
};

