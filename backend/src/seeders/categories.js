'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("categories", [
    { name: "Sáp vuốt tóc", description: "Wax, pomade, clay tạo kiểu", createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu gội", description: "Các loại dầu gội chăm sóc tóc", createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu xả & Serum", description: "Dầu xả, serum dưỡng tóc", createdAt: new Date(), updatedAt: new Date() },
    { name: "Xịt dưỡng", description: "Xịt dưỡng, bảo vệ tóc", createdAt: new Date(), updatedAt: new Date() },
    { name: "Phụ kiện tóc", description: "Lược, máy sấy, dụng cụ tạo kiểu", createdAt: new Date(), updatedAt: new Date() }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("categories", null, {});
}
