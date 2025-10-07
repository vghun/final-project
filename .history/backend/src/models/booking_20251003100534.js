"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Booking thuộc về Customer
      Booking.belongsTo(models.Customer, { foreignKey: "idCustomer" });
      // Booking có thể gán cho Barber
      Booking.belongsTo(models.Barber, { foreignKey: "idBarber" });
      // Booking có thể có Voucher của Customer
      Booking.belongsTo(models.CustomerVoucher, { foreignKey: "idCustomerVoucher" });
      // Booking có nhiều BookingDetail
      Booking.hasMany(models.BookingDetail, { foreignKey: "idBooking" });
       Booking.hasOne(models.BookingTip, { foreignKey: "idBooking", as: "BookingTip" });
    }
  }

  Booking.init(
    {
      idBooking: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idCustomer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idBarber: DataTypes.INTEGER,
      idCustomerVoucher: DataTypes.INTEGER,
      guestCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bookingTime: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Completed", "Cancelled"),
        defaultValue: "Pending",
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
    }
  );

  return Booking;
};
