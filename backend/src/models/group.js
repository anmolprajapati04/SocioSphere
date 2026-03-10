module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM('SOCIETY', 'CUSTOM'), defaultValue: 'CUSTOM' },
    },
    {
      tableName: 'groups',
      timestamps: true,
    }
  );
  return Group;
};

