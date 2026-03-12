module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define(
    "Complaint",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      society_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      resident_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "LOW"
      },

      status: {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "RESOLVED"),
        defaultValue: "PENDING"
      },

      admin_response: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "complaints",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  Complaint.associate = (models) => {
    Complaint.belongsTo(models.User, {
      foreignKey: "resident_id",
      as: "User"
    });
  };

  return Complaint;
};