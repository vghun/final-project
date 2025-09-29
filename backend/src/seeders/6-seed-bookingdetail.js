"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("booking_details", [
    { idBooking: 1, idService: 1, quantity: 1, price: 100000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 2, idService: 4, quantity: 2, price: 500000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 3, idService: 3, quantity: 1, price: 200000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 4, idService: 5, quantity: 1, price: 600000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 5, idService: 1, quantity: 2, price: 100000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 5, idService: 2, quantity: 1, price: 150000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 6, idService: 2, quantity: 1, price: 150000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 7, idService: 1, quantity: 1, price: 100000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 8, idService: 4, quantity: 2, price: 500000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 9, idService: 3, quantity: 1, price: 200000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 10, idService: 5, quantity: 1, price: 600000, createdAt: new Date(), updatedAt: new Date() },
    { idBooking: 10, idService: 1, quantity: 1, price: 100000, createdAt: new Date(), updatedAt: new Date() },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("booking_details", null, {});
}
