"use strict";

export async function up(queryInterface, Sequelize) {
  const branches = [1, 2, 3]; // 3 chi nhánh
  const services = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 dịch vụ

  const assignments = [];

  branches.forEach((branchId) => {
    services.forEach((serviceId) => {
      assignments.push({
        idBranch: branchId,
        idService: serviceId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  await queryInterface.bulkInsert("service_assignments", assignments, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("service_assignments", null, {});
}
