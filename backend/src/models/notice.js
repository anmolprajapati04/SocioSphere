module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define(
    'Notice',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      valid_from: { type: DataTypes.DATE },
      valid_to: { type: DataTypes.DATE },
    },
    {
      tableName: 'notices',
      timestamps: true,
    }
  );
  return Notice;
};

