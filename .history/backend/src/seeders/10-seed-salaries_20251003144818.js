"use strict";

export async function up(queryInterface, Sequelize) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // 2025
  const currentMonth = currentDate.getMonth() + 1; // JS 0-indexed, nên +1
  const lastYear = 2024;

  const barbers = [7,8,9,10,11,12,13,14,15,16];
  const salaries = [];

  barbers.forEach(idBarber => {
    // Năm 2024: tạo đủ 12 tháng
    for (let month = 1; month <= 12; month++) {
      const baseSalary = Math.floor(Math.random() * 3000000) + 5000000; // 5M → 8M
      const commission = Math.floor(Math.random() * 2000000); // 0 → 2M
      const tips = Math.floor(Math.random() * 1000000); // 0 → 1M
      const totalSalary = baseSalary + commission + tips;

      salaries.push({
        idBarber,
        month,
        year: lastYear,
        baseSalary,
        commission,
        tips,
        totalSalary,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Năm hiện tại: chỉ tạo cho các tháng đã qua
    for (let month = 1; month < currentMonth; month++) {
      const baseSalary = Math.floor(Math.random() * 3000000) + 5000000;
      const commission = Math.floor(Math.random() * 2000000);
      const tips = Math.floor(Math.random() * 1000000);
      const totalSalary = baseSalary + commission + tips;

      salaries.push({
        idBarber,
        month,
        year: currentYear,
        baseSalary,
        commission,
        tips,
        totalSalary,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  await queryInterface.bulkInsert("salaries", salaries);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("salaries", null, {});
}
