'use strict';

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
      primaryKey: true,
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
      primaryKey: true, // ✅ Add this
    },
    lastViewedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    timestamps: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('reel_views');
}
