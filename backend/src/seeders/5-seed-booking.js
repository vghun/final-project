'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const customers = [2, 3, 4, 5, 6];
  const barbers = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Lấy thông tin branch
  const branches = await queryInterface.sequelize.query(
    `SELECT idBranch, openTime, closeTime, slotDuration FROM branches`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const totalBookings = 10000;
  const months = 12;
  const bookingsPerMonth = Math.floor(totalBookings / months);
  const bookings = [];

  for (let month = 0; month < months; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate();
    const bookingsPerDay = Math.ceil(bookingsPerMonth / daysInMonth);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day);

      for (const barberId of barbers) {
        // Chọn ngẫu nhiên một chi nhánh cho thợ này
        const branch = branches[Math.floor(Math.random() * branches.length)];

        // Tính số slot trong ngày
        const [openH, openM, openS] = branch.openTime.split(':').map(Number);
        const [closeH, closeM, closeS] = branch.closeTime.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;
        const slotDuration = branch.slotDuration;
        const totalSlots = Math.floor((closeMinutes - openMinutes) / slotDuration);

        for (let i = 0; i < Math.ceil(bookingsPerDay / barbers.length); i++) {
          // Chọn ngẫu nhiên một slot
          const slotIndex = Math.floor(Math.random() * totalSlots);
          const bookingMinutes = openMinutes + slotIndex * slotDuration;
          const hour = Math.floor(bookingMinutes / 60);
          const minute = bookingMinutes % 60;
          const bookingTime = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;

          const customerId = customers[Math.floor(Math.random() * customers.length)];

          bookings.push({
            idCustomer: customerId,
            idBarber: barberId,
            bookingDate: date,
            bookingTime,
            status: ["Pending", "Completed", "Cancelled"][Math.floor(Math.random() * 3)],
            description: `Booking ${bookingTime} ngày ${date.toISOString().split('T')[0]} - Barber ${barberId} - Branch ${branch.idBranch}`,
            total: 0,
            isPaid: Math.random() > 0.5,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }
  }

  console.log(`Tổng booking sẽ tạo: ${bookings.length}`);
  await queryInterface.bulkInsert('bookings', bookings);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('bookings', {
    bookingDate: {
      [Sequelize.Op.between]: [new Date("2025-01-01"), new Date("2025-12-31")]
    }
  });
}
