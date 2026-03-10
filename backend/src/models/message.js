module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      group_id: { type: DataTypes.INTEGER },
      sender_id: { type: DataTypes.INTEGER, allowNull: false },
      recipient_id: { type: DataTypes.INTEGER },
      body: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'messages',
      timestamps: true,
    }
  );
  return Message;
};

