"use strict";

export async function up(queryInterface, Sequelize) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const barbers = [7,8,9,10,11,12,13,14,15,16];

  const salaries = [];

  barbers.forEach(idBarber => {
    [lastYear, currentYear].forEach(year => {
      // Chọn ngẫu nhiên 3 tháng trong năm
      const months = [1, 4, 7, 10]; // bạn có thể thay đổi
      months.forEach(month => {
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
      });
    });
  });

  await queryInterface.bulkInsert("salaries", salaries);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("salaries", null, {});
}
