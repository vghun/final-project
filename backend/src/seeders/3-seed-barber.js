"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("barbers", [
    {
      idBarber: 7,
      idBranch: 1,
      profileDescription: `
- Kinh nghiệm: 5 năm trong các kiểu tóc nam hiện đại
- Chuyên môn: Fade, undercut, pompadour, tạo kiểu râu
- Phong cách: Thời thượng, gọn gàng
- Chứng chỉ / Giải thưởng: BarberPro Level 2, Giải HairShow 2022
- Triết lý: Luôn lắng nghe mong muốn khách hàng và nâng tầm phong cách cá nhân của họ
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 8,
      idBranch: 1,
      profileDescription: `
- Kinh nghiệm: 6 năm trong các kiểu tóc nữ
- Chuyên môn: Nhuộm, uốn, cắt tóc hiện đại
- Phong cách: Sáng tạo, thanh lịch
- Chứng chỉ / Giải thưởng: ColorMaster Certification, HairArt 2021
- Triết lý: Biến đổi diện mạo khách hàng trong khi vẫn giữ tóc khỏe mạnh
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 9,
      idBranch: 1,
      profileDescription: `
- Kinh nghiệm: 4 năm trong cắt tóc trẻ em
- Chuyên môn: Cắt tóc nhanh, an toàn, vui nhộn cho trẻ
- Phong cách: Thân thiện, kiên nhẫn, chuyên nghiệp
- Chứng chỉ: ChildSafety Haircut Workshop
- Triết lý: Biến trải nghiệm cắt tóc thành niềm vui cho trẻ nhỏ
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 10,
      idBranch: 1,
      profileDescription: `
- Kinh nghiệm: 7 năm trong chăm sóc tóc và râu nam
- Chuyên môn: Tạo kiểu râu, cắt tóc cổ điển, fade
- Phong cách: Chi tiết, chính xác, gọn gàng
- Chứng chỉ: Master Barber Certificate, Grooming Expo 2023
- Triết lý: Độ chính xác và phong cách trong từng đường cắt
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 11,
      idBranch: 2,
      profileDescription: `
- Kinh nghiệm: 5 năm trong nhuộm và tạo kiểu tóc nữ
- Chuyên môn: Highlights, balayage, uốn xoăn
- Phong cách: Sáng tạo, thanh lịch
- Chứng chỉ / Giải thưởng: HairColor Specialist, International HairShow 2022
- Triết lý: Tôn vinh vẻ đẹp tự nhiên và giữ tóc khỏe mạnh
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 12,
      idBranch: 2,
      profileDescription: `
- Kinh nghiệm: 6 năm trong tạo kiểu chuyên nghiệp
- Chuyên môn: Uốn, duỗi, cắt tóc hiện đại
- Phong cách: Thời thượng, linh hoạt
- Chứng chỉ: Hair Styling Advanced Diploma
- Triết lý: Mỗi khách hàng xứng đáng có kiểu tóc cá nhân hóa
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 13,
      idBranch: 2,
      profileDescription: `
- Kinh nghiệm: 8 năm trong tóc nam
- Chuyên môn: Cắt cổ điển, fade, chăm sóc râu
- Phong cách: Gọn gàng, phong độ, nam tính
- Chứng chỉ: BarberPro Level 3, MaleStyle 2021
- Triết lý: Giúp mỗi người đàn ông trông sắc sảo và tự tin
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 14,
      idBranch: 3,
      profileDescription: `
- Kinh nghiệm: 5 năm trong cắt và tạo kiểu tóc nữ
- Chuyên môn: Cắt hiện đại, layer, kiểu thanh lịch
- Phong cách: Thanh lịch, tỉ mỉ
- Chứng chỉ: HairCutting Excellence, StylePro 2022
- Triết lý: Vẻ đẹp nằm trong những chi tiết nhỏ
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 15,
      idBranch: 3,
      profileDescription: `
- Kinh nghiệm: 4 năm trong cắt tóc trẻ em
- Chuyên môn: An toàn, nhanh chóng, tạo kiểu vui nhộn
- Phong cách: Thân thiện, gần gũi
- Chứng chỉ: Child Haircut Certification
- Triết lý: Cắt tóc nên là trải nghiệm vui và thoải mái cho trẻ
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idBarber: 16,
      idBranch: 3,
      profileDescription: `
- Kinh nghiệm: 7 năm trong chăm sóc tóc và râu nam
- Chuyên môn: Tạo kiểu râu, fade, cắt tóc cổ điển
- Phong cách: Chính xác, chuyên nghiệp
- Chứng chỉ: Master Barber, Grooming Excellence 2023
- Triết lý: Phong cách và chính xác trong từng đường cắt
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("barbers", null, {});
}
