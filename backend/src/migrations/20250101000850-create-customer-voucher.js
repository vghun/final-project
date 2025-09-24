'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('customer_voucher', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCustomer: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'customers', key: 'idCustomer' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    idVoucher: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'vouchers', key: 'idVoucher' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'unused', // unused, used, expired
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('customer_voucher');
}
