"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("services", [
    // 💈 Dịch vụ nam (Category 1)
    {
      idService: 1,
      name: "Cắt tóc nam basic",
      description: "Cắt tóc nam đơn giản, nhanh gọn",
      price: 100000,
      duration: 30,
      status: "Active",
      image: "https://i.pinimg.com/736x/49/4d/55/494d5517e87350cce1bd44023b0f7728.jpg", // ✅ đổi url -> image
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idService: 2,
      name: "Cắt tóc nam tạo kiểu",
      description: "Cắt fade, undercut, pompadour hiện đại",
      price: 150000,
      duration: 45,
      status: "Active",
      image: "https://i.pinimg.com/736x/0c/df/2b/0cdf2b43b3535766dabb727379cf0b7b.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idService: 3,
      name: "Cạo mặt / tạo kiểu râu",
      description: "Chăm sóc và tạo kiểu râu, cạo gọn gàng",
      price: 100000,
      duration: 20,
      status: "Active",
      image: "https://i.pinimg.com/736x/43/3a/9e/433a9e7ce02eb2dbd58c57d43bbcf9a3.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idService: 4,
      name: "Gội đầu nam",
      description: "Gội sạch, massage thư giãn",
      price: 50000,
      duration: 15,
      status: "Active",
      image: "https://i.pinimg.com/736x/00/cd/b1/00cdb113ab219a6700e676e99a3caeb3.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idService: 5,
      name: "Uốn / Nhuộm tóc nam",
      description: "Uốn hoặc nhuộm tóc theo yêu cầu",
      price: 300000,
      duration: 60,
      status: "Active",
      image: "https://i.pinimg.com/736x/4c/26/8e/4c268e2663468da9ea4cd3a789d88d29.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 💇‍♀️ Dịch vụ nữ (Category 2)
    {
      idService: 6,
      name: "Cắt tóc nữ layer",
      description: "Cắt layer nữ tự nhiên",
      price: 200000,
      duration: 60,
      status: "Active",
      image: "https://i.pinimg.com/1200x/69/75/06/697506382f0988cd401da8e41ba50f69.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 🎨 Nhuộm & uốn (Category 3)
    {
      idService: 7,
      name: "Nhuộm highlight",
      description: "Tạo điểm nhấn nổi bật với highlight",
      price: 500000,
      duration: 90,
      status: "Active",
      image: "https://i.pinimg.com/736x/2c/b1/6b/2cb16ba0ce50615728f36007f81b00d4.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idService: 8,
      name: "Uốn tóc xoăn sóng",
      description: "Uốn xoăn sóng nước tự nhiên",
      price: 600000,
      duration: 120,
      status: "Active",
      image: "https://i.pinimg.com/1200x/cf/35/15/cf35153e96d969659b72d6bb584d6872.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("services", null, {});
}
