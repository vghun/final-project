"use strict";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Danh sách khách hàng và barber
  const customers = [2, 3, 4, 5, 6];
  const barbers = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Lấy thông tin chi nhánh từ bảng branches
  const branches = await queryInterface.sequelize.query(
    `SELECT idBranch, openTime, closeTime, slotDuration FROM branches`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const bookings = [];
  const maxBookings = 1000;

  for (let i = 0; i < maxBookings; i++) {
    // Random tháng (1 - 9)
    const month = Math.floor(Math.random() * 9); // 0 = Jan, 8 = Sep
    const daysInMonth = new Date(2025, month + 1, 0).getDate();
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const date = new Date(2025, month, day);

    // Chọn random barber, customer, branch
    const barberId = barbers[Math.floor(Math.random() * barbers.length)];
    const customerId = customers[Math.floor(Math.random() * customers.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];

    // Tính thời gian đặt lịch dựa theo openTime, closeTime, slotDuration
    const [openH, openM] = branch.openTime.split(":").map(Number);
    const [closeH, closeM] = branch.closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    const slotDuration = branch.slotDuration;
    const totalSlots = Math.floor((closeMinutes - openMinutes) / slotDuration);

    const slotIndex = Math.floor(Math.random() * totalSlots);
    const bookingMinutes = openMinutes + slotIndex * slotDuration;
    const hour = Math.floor(bookingMinutes / 60);
    const minute = bookingMinutes % 60;
    const bookingTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    bookings.push({
      idCustomer: customerId,
      idBarber: barberId,
      bookingDate: date,
      bookingTime,
      status: "Completed",
      description: `Hoàn tất lúc ${bookingTime} ngày ${date
        .toISOString()
        .split("T")[0]} - Barber ${barberId} - Branch ${branch.idBranch}`,
      total: Math.floor(Math.random() * 500000) + 100000, // ngẫu nhiên 100k–600k
      isPaid: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(`✅ Sẽ tạo ${bookings.length} booking Completed & đã trả tiền`);
  await queryInterface.bulkInsert("bookings", bookings);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("bookings", {
    bookingDate: {
      [Sequelize.Op.between]: [new Date("2025-01-01"), new Date("2025-09-30")],
    },
  });
}
