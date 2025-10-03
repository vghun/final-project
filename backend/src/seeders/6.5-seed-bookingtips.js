"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("booking_tips", [
    {
      idBooking: 1,
      idBarber: 7,
      tipAmount: 50000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBooking: 2,
      idBarber: 7,
      tipAmount: 30000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBooking: 3,
      idBarber: 8,
      tipAmount: 40000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBooking: 4,
      idBarber: 9,
      tipAmount: 20000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBooking: 5,
      idBarber: 10,
      tipAmount: 60000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Bạn có thể thêm nhiều booking tips khác
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("booking_tips", null, {});
}
