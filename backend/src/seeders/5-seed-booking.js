"use strict";

export async function up(queryInterface, Sequelize) {
  const bookings = [];

  const barberIds = [7,8,9,10,11,12,13,14,15,16];
 const bookingDates = [
    "2025-09-01","2025-09-02","2025-09-03","2025-09-04",
    "2025-09-05","2025-09-06","2025-09-07","2025-09-08",
    "2025-09-09","2025-09-10"
];


  let idBooking = 1;

  for(let date of bookingDates){
    for(let barberId of barberIds){
      const randomGuests = Math.floor(Math.random() * 3) + 1; // 1 → 3
      const randomHour = Math.floor(Math.random() * 12) + 9; // 9 → 20 giờ
      const randomMinute = Math.random() < 0.5 ? "00" : "30";
      const description = `Dịch vụ mẫu cho barber ${barberId}`;

      bookings.push({
        idBooking: idBooking++,
        idCustomer: 2 + Math.floor(Math.random() * 5), // customer id từ 2 → 6
        idBarber: barberId,
        idCustomerVoucher: null,
        guestCount: 1,
        bookingDate: new Date(date),
        bookingTime: `${randomHour}:${randomMinute}`,
        status:"Completed",
        description: description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if(idBooking > 40) break; // tạo khoảng 40 booking
    }
    if(idBooking > 40) break;
  }

  await queryInterface.bulkInsert("bookings", bookings);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("bookings", null, {});
}
