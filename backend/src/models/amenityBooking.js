module.exports = (sequelize, DataTypes) => {
  const AmenityBooking = sequelize.define(
    'AmenityBooking',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      society_id: { type: DataTypes.INTEGER, allowNull: false },
      amenity_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      start_time: { type: DataTypes.DATE, allowNull: false },
      end_time: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
        defaultValue: 'PENDING',
      },
    },
    {
      tableName: 'amenity_bookings',
      timestamps: true,
    }
  );
  return AmenityBooking;
};

