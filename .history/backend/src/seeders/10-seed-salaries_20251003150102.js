"use strict";

export async function up(queryInterface, Sequelize) {
  const years = [2024, 2025];
  const barbers = [7,8,9,10,11,12,13,14,15,16];
  const salaries = [];

  barbers.forEach(idBarber => {
    years.forEach(year => {
      for (let month = 1; month <= 12; month++) {
        const baseSalary = Math.floor(Math.random() * 3000000) + 5000000; // 5M → 8M
        const commission = Math.floor(Math.random() * 2000000); // 0 → 2M
        const tips = Math.floor(Math.random() * 1000000); // 0 → 1M
        const totalSalary = baseSalary + commission + tips;

        salaries.push({
          idBarber,
          month,
          year,
          baseSalary,
          commission,
          tips,
          totalSalary,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  });

  await queryInterface.bulkInsert("salaries", salaries);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("salaries", null, {});
}
