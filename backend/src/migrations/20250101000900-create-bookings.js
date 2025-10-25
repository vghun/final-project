  'use strict';

  export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      idBooking: {
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
      idBarber: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "barbers", key: "idBarber" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      idCustomerVoucher: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'customer_voucher', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      guestCount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      bookingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      bookingTime: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Cancelled'),
        defaultValue: 'Pending',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },

      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('bookings');
  }
