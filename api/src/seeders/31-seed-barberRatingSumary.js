// src/seeders/13-seed-barber-rating-summary.js
"use strict";

export async function up(queryInterface, Sequelize) {
  // Lấy tất cả barber hiện có
  const barbers = await queryInterface.sequelize.query(
    `SELECT idBarber FROM barbers;`,
    { type: Sequelize.QueryTypes.SELECT }
  );
 // kiểm tra

  const ratingData = barbers.map((b) => ({
    idBarber: b.idBarber,
    totalRate: Math.floor(Math.random() * 20) + 1, // 1 → 20 lượt
    avgRate: parseFloat((Math.random() * 2 + 3).toFixed(2)), // 3 → 5 điểm
  }));

  if (ratingData.length > 0) {
    await queryInterface.bulkInsert("barber_rating_summaries", ratingData, {});
    console.log("Seeder rating inserted:", ratingData);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("barber_rating_summaries", null, {});
}
