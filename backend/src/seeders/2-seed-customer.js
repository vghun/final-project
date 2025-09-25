"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("customers", [
    {
      idCustomer: 2, // customer1
      loyaltyPoint: 120,
      address: "123 Lê Lợi, Q1, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCustomer: 4, // customer2
      loyaltyPoint: 80,
      address: "456 Hai Bà Trưng, Q3, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("customers", null, {});
}
