"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("customers", [
    {
      idCustomer: 2, // customer1@example.com
      loyaltyPoint: 120,
      address: "123 Lê Lợi, Q1, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCustomer: 3, // customer2@example.com
      loyaltyPoint: 100,
      address: "456 Hai Bà Trưng, Q3, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCustomer: 4, // customer3@example.com
      loyaltyPoint: 80,
      address: "789 Nguyễn Trãi, Q5, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCustomer: 5, // customer4@example.com
      loyaltyPoint: 90,
      address: "321 Phan Đình Phùng, Q3, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idCustomer: 6, // customer5@example.com
      loyaltyPoint: 110,
      address: "654 Trần Hưng Đạo, Q1, TP.HCM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("customers", null, {});
}
