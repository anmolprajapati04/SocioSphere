module.exports = (sequelize, DataTypes) => {
  const Society = sequelize.define(
    'Society',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: 'societies',
      timestamps: true,
    }
  );
  return Society;
};

