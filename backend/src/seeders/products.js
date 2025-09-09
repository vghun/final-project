'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("products", [
    // Category 1: Sáp vuốt tóc
    { name: "Wax Gatsby", description: "Giữ nếp lâu, không bết dính", price: 250000, views: 1200, sold: 500, discount: 10, image: "gatsby.jpg", categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: "Pomade American Crew", description: "Độ bóng cao, phong cách cổ điển", price: 320000, views: 800, sold: 300, discount: 15, image: "crew.jpg", categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: "Clay Matte Uppercut", description: "Độ mờ, giữ nếp mạnh", price: 280000, views: 600, sold: 200, discount: 12, image: "uppercut.jpg", categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: "Pomade Suavecito", description: "Dễ rửa, mùi hương nam tính", price: 300000, views: 700, sold: 250, discount: 18, image: "suavecito.jpg", categoryId: 1, createdAt: new Date(), updatedAt: new Date() },

    // Category 2: Dầu gội
    { name: "Dầu gội Head & Shoulders", description: "Chống gàu hiệu quả", price: 120000, views: 2000, sold: 600, discount: 5, image: "headshoulders.jpg", categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu gội Clear Men", description: "Ngăn gàu, mát lạnh da đầu", price: 110000, views: 1700, sold: 550, discount: 8, image: "clear.jpg", categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu gội Pantene", description: "Chăm sóc tóc hư tổn", price: 150000, views: 1300, sold: 400, discount: 10, image: "pantene.jpg", categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu gội TRESemmé", description: "Salon tại nhà", price: 180000, views: 1400, sold: 450, discount: 12, image: "tresemme.jpg", categoryId: 2, createdAt: new Date(), updatedAt: new Date() },

    // Category 3: Dầu xả & Serum
    { name: "Dầu xả Dove", description: "Mềm mượt tự nhiên", price: 140000, views: 1000, sold: 300, discount: 20, image: "dove.jpg", categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: "Serum Tsubaki", description: "Dưỡng tóc bóng mượt", price: 280000, views: 900, sold: 200, discount: 25, image: "tsubaki.jpg", categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: "Dầu xả Sunsilk", description: "Thơm ngát, mềm mại", price: 130000, views: 800, sold: 250, discount: 15, image: "sunsilk.jpg", categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: "Serum L'Oreal", description: "Phục hồi tóc hư tổn", price: 300000, views: 950, sold: 220, discount: 30, image: "loreal.jpg", categoryId: 3, createdAt: new Date(), updatedAt: new Date() },

    // Category 4: Xịt dưỡng
    { name: "Xịt dưỡng Tresemmé", description: "Giảm xơ rối, bảo vệ nhiệt", price: 200000, views: 1300, sold: 350, discount: 12, image: "tresemme-spray.jpg", categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: "Xịt dưỡng Mise en Scène", description: "Dưỡng tóc suôn mượt", price: 220000, views: 800, sold: 180, discount: 10, image: "mise.jpg", categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: "Xịt dưỡng L'Oreal", description: "Bảo vệ tóc khi tạo kiểu", price: 250000, views: 900, sold: 200, discount: 20, image: "loreal-spray.jpg", categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: "Xịt dưỡng Pantene", description: "Giúp tóc khỏe mạnh", price: 190000, views: 750, sold: 150, discount: 15, image: "pantene-spray.jpg", categoryId: 4, createdAt: new Date(), updatedAt: new Date() },

    // Category 5: Phụ kiện tóc
    { name: "Lược gỗ chống tĩnh điện", description: "Bảo vệ tóc, chống xơ rối", price: 80000, views: 500, sold: 100, discount: 5, image: "comb.jpg", categoryId: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: "Máy sấy tóc Philips", description: "Sấy nhanh, bảo vệ tóc", price: 450000, views: 600, sold: 120, discount: 10, image: "dryer.jpg", categoryId: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: "Kẹp tóc Hàn Quốc", description: "Thời trang, tiện dụng", price: 50000, views: 400, sold: 80, discount: 8, image: "clip.jpg", categoryId: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: "Máy uốn tóc Kemei", description: "Tạo kiểu xoăn dễ dàng", price: 550000, views: 700, sold: 150, discount: 20, image: "curler.jpg", categoryId: 5, createdAt: new Date(), updatedAt: new Date() }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("products", null, {});
}
