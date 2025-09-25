"use strict";

import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await queryInterface.bulkInsert("users", [
    {
      idUser: 1,
      email: "admin@example.com",
      password: hashedPassword,
      fullName: "System Admin",
      phoneNumber: "0900000001",
      isStatus: true,
      image: null,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idUser: 2,
      email: "customer1@example.com",
      password: hashedPassword,
      fullName: "Nguyen Van A",
      phoneNumber: "0900000002",
      isStatus: true,
      image: null,
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idUser: 3,
      email: "barber1@example.com",
      password: hashedPassword,
      fullName: "Tran Van B",
      phoneNumber: "0900000003",
      isStatus: true,
      image: null,
      role: "barber",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idUser: 4,
      email: "customer2@example.com",
      password: hashedPassword,
      fullName: "Le Thi C",
      phoneNumber: "0900000004",
      isStatus: true,
      image: null,
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idUser: 5,
      email: "barber2@example.com",
      password: hashedPassword,
      fullName: "Pham Van D",
      phoneNumber: "0900000005",
      isStatus: true,
      image: null,
      role: "barber",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("users", null, {});
}
