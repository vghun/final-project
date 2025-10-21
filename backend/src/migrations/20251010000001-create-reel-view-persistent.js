'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('reel_views', {
    idReel: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'reels', 
        key: 'idReel',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true, // Khóa chính kép
    },
    idUser: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users', 
        key: 'idUser',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    lastViewedAt: { // Thay thế cho viewedAt để tiện cho việc loại trừ
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    uniqueKeys: {
      reel_user_unique: {
        fields: ['idReel', 'idUser'],
      },
    },
    timestamps: false, 
  });
};

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('reel_views');
};