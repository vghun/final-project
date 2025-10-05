"use strict";

export async function up(queryInterface, Sequelize) {
  // Lấy tất cả booking hiện có
  const bookings = await queryInterface.sequelize.query(
    `SELECT idBooking, idBarber FROM bookings`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const bookingDetails = [];

  // Danh sách dịch vụ mẫu
  const services = [
    { idService: 1, name: "Gội đầu", price: 100000 },
    { idService: 2, name: "Cạo mặt", price: 150000 },
    { idService: 3, name: "Cắt tóc", price: 200000 },
    { idService: 4, name: "Nhuộm tóc", price: 250000 },
    { idService: 5, name: "Massage đầu", price: 300000 },
  ];

  for (const booking of bookings) {
    // Giả lập mỗi booking có 1-3 dịch vụ
    const numServices = Math.floor(Math.random() * 3) + 1;
    const chosenServices = services.sort(() => 0.5 - Math.random()).slice(0, numServices);

    for (const service of chosenServices) {
      bookingDetails.push({
        idBooking: booking.idBooking,
        idService: service.idService,
        idBarber: booking.idBarber, // Lấy idBarber từ booking
        quantity: 1,
        price: service.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  await queryInterface.bulkInsert("booking_details", bookingDetails);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("booking_details", null, {});
}
