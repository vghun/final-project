'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Lấy tất cả booking hiện có
  const bookings = await queryInterface.sequelize.query(
    `SELECT idBooking, idBarber FROM bookings WHERE isPaid = true`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const bookingTips = bookings.map(booking => ({
    idBooking: booking.idBooking,
    idBarber: booking.idBarber,
    tipAmount: Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000, // 20k → 100k
    createdAt: now,
    updatedAt: now,
  }));

  await queryInterface.bulkInsert('booking_tips', bookingTips);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('booking_tips', null, {});
}
