"use strict";

export async function up(queryInterface) {
  await queryInterface.bulkInsert("banners", [
    {
      title: "Ưu đãi tháng này",
      imageUrl: "https://i.pinimg.com/736x/6c/8f/01/6c8f01be1d4d76d7ffcc781710816051.jpg",
      linkUrl: "/promotions",
      startAt: new Date(),
      endAt: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Ưu đãi tháng này",
      imageUrl: "https://i.pinimg.com/1200x/05/6d/d3/056dd39fccee614d4e46d77ef8814bf8.jpg",
      linkUrl: "/promotions",
      startAt: new Date(),
      endAt: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("banners", null, {});
}
