const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if admin already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT * FROM "Users" WHERE email = 'myeveadmin@gmail.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length === 0) {
      // Create admin account
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      
      await queryInterface.bulkInsert('Users', [{
        id: uuidv4(),
        username: 'admin1',
        email: 'myeveadmin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      
      console.log('✅ Admin account created successfully!');
      console.log('📧 Email: myeveadmin@gmail.com');
      console.log('🔑 Password: Admin123!');
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'myeveadmin@gmail.com' });
  }
}; 