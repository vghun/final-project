"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("reel_hashtags", [
    { idReel: 1, idHashtag: 1, createdAt: new Date() }, // Fade
    { idReel: 1, idHashtag: 2, createdAt: new Date() }, // BarberStyle
    { idReel: 2, idHashtag: 3, createdAt: new Date() }, // LayerCut
    { idReel: 2, idHashtag: 4, createdAt: new Date()}, // StylePro
    { idReel: 3, idHashtag: 5, createdAt: new Date()}, // KidHaircut
    { idReel: 3, idHashtag: 6, createdAt: new Date() }, // FunBarber
    { idReel: 4, idHashtag: 7, createdAt: new Date()}, // BeardTrim
    { idReel: 4, idHashtag: 8, createdAt: new Date()}, // ClassicMen
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("reel_hashtags", null, {});
}
