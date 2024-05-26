module.exports = (sequelize, DataTypes) => {
  const FormData = sequelize.define("FormData", {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    securityCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ref: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return FormData;
};
