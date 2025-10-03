export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("services", [
    // Dịch vụ nam (Category 1)
    {
      idService: 1,
      name: "Cắt tóc nam basic",
      description: "Cắt tóc nam đơn giản, nhanh gọn",
      price: 100000,
      duration: 30,
      status: "Active",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Dịch vụ nữ (Category 2)
    {
      idService: 6,
      name: "Cắt tóc nữ layer",
      description: "Cắt layer nữ tự nhiên",
      price: 200000,
      duration: 60,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Nhuộm & uốn (Category 3)
    {
      idService: 7,
      name: "Nhuộm highlight",
      description: "Tạo điểm nhấn nổi bật với highlight",
      price: 500000,
      duration: 90,
      status: "Active",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("services", null, {});
}