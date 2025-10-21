'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Lấy tất cả booking hiện có
  const bookings = await queryInterface.sequelize.query(
    `SELECT idBooking FROM bookings`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const services = [
    { idService: 1, name: "Gội đầu", price: 100000 },
    { idService: 2, name: "Cạo mặt", price: 150000 },
    { idService: 3, name: "Cắt tóc", price: 200000 },
    { idService: 4, name: "Nhuộm tóc", price: 250000 },
    { idService: 5, name: "Massage đầu", price: 300000 },
  ];

  const bookingDetails = [];

  for (const booking of bookings) {
    const numServices = Math.floor(Math.random() * 3) + 1; // 1-3 dịch vụ
    const chosenServices = services.sort(() => 0.5 - Math.random()).slice(0, numServices);

    let total = 0;

    for (const service of chosenServices) {
      bookingDetails.push({
        idBooking: booking.idBooking,
        idService: service.idService,
        quantity: 1,
        price: service.price,
        createdAt: now,
        updatedAt: now,
      });
      total += service.price;
    }

    // Cập nhật tổng tiền booking
    await queryInterface.sequelize.query(
      `UPDATE bookings SET total = ${total} WHERE idBooking = ${booking.idBooking}`
    );
  }

  await queryInterface.bulkInsert('booking_details', bookingDetails);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('booking_details', null, {});
}
