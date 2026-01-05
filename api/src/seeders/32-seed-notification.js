"use strict";

export async function up(queryInterface) {
  await queryInterface.bulkInsert("notifications", [
    {
      type: "BOOKING",
      title: "Đặt lịch thành công",
      content: "Bạn đã đặt lịch cắt tóc thành công.",
      targetRole: "customer",
      targetId: 2,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("notifications", null, {});
}
