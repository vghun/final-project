'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Lấy tất cả booking hiện có
  const bookings = await queryInterface.sequelize.query(
    `SELECT idBooking FROM bookings`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  // Danh sách dịch vụ thực tế (theo seeder services)
  const services = [
    { idService: 1, name: "Cắt tóc nam basic", price: 100000 },
    { idService: 2, name: "Cắt tóc nam tạo kiểu", price: 150000 },
    { idService: 3, name: "Cạo mặt / tạo kiểu râu", price: 100000 },
    { idService: 4, name: "Gội đầu nam", price: 50000 },
    { idService: 5, name: "Uốn / Nhuộm tóc nam", price: 300000 },
    { idService: 6, name: "Cắt tóc nữ layer", price: 200000 },
    { idService: 7, name: "Nhuộm highlight", price: 500000 },
    { idService: 8, name: "Uốn tóc xoăn sóng", price: 600000 },
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

  // Chèn tất cả booking_details
  if (bookingDetails.length > 0) {
    await queryInterface.bulkInsert('booking_details', bookingDetails);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('booking_details', null, {});
}
