'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const customers = [2, 3, 4, 5, 6]; // danh sách id customer
  const barbers = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // danh sách thợ
  const bookings = [];

  for (const barberId of barbers) {
    // random số booking của mỗi thợ (2–3 khung giờ)
    const numBookings = 2 + Math.floor(Math.random() * 2);

    // random giờ bắt đầu (ví dụ: 9 -> 17)
    const startHour = 9 + Math.floor(Math.random() * (18 - numBookings));

    for (let j = 0; j < numBookings; j++) {
      const bookingHour = startHour + j; // cách nhau 1 tiếng
      const bookingTime = `${bookingHour.toString().padStart(2, '0')}:00`;

      const customerId = customers[Math.floor(Math.random() * customers.length)];

      bookings.push({
        idCustomer: customerId,
        idBarber: barberId,
        bookingDate: today,
        bookingTime,
        status: ["Pending", "Completed", "Cancelled"][Math.floor(Math.random() * 3)],
        description: `Booking ${bookingTime} ngày ${today.toISOString().split('T')[0]} - Barber ${barberId}`,
        total: 0,
        isPaid: Math.random() > 0.5,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert('bookings', bookings);
}

export async function down(queryInterface, Sequelize) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await queryInterface.bulkDelete('bookings', {
    bookingDate: today,
  });
}
