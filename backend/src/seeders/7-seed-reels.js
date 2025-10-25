"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("reels", [
    {
      idBarber: 7,
      title: "Cắt Fade chuẩn #Fade #BarberStyle",
      url: "https://res.cloudinary.com/xuandung/video/upload/v1761365338/reels/qgpm8q5hmnkkps8nnusl.mp4",
      thumbnail: "https://res.cloudinary.com/xuandung/video/upload/so_1/v1761365338/reels/qgpm8q5hmnkkps8nnusl.jpg",
      description: "Kỹ thuật fade mượt mà, blend đều và sạch.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 7,
      title: "Tạo kiểu tóc nữ #LayerCut #StylePro",
      url: "https://res.cloudinary.com/xuandung/video/upload/v1761365409/reels/yvchoyhllajhix6i2u10.mp4",
      thumbnail: "https://res.cloudinary.com/xuandung/video/upload/so_1/v1761365409/reels/yvchoyhllajhix6i2u10.jpg",
      description: "Mẫu tóc layer tự nhiên dành cho tóc dài.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 7,
      title: "Cắt tóc trẻ em vui nhộn #KidHaircut #FunBarber",
      url: "https://res.cloudinary.com/xuandung/video/upload/v1761365442/reels/nrtfehbptaaale4nswvb.mp4",
      thumbnail: "https://res.cloudinary.com/xuandung/video/upload/so_1/v1761365442/reels/nrtfehbptaaale4nswvb.jpg",
      description: "Tạo cảm giác thoải mái cho trẻ khi cắt tóc.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 10,
      title: "Tạo kiểu râu đẹp #BeardTrim #ClassicMen",
      url: "https://res.cloudinary.com/xuandung/video/upload/v1761365472/reels/ts4xl9lmnjdbxeb8ebfl.mp4",
      thumbnail: "https://res.cloudinary.com/xuandung/video/upload/so_1/v1761365472/reels/ts4xl9lmnjdbxeb8ebfl.jpg",
      description: "Đường cắt tinh tế, phong cách cổ điển nam tính.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("reels", null, {});
}
