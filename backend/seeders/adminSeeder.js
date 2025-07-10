const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({
        where: { email: 'myeveadmin@gmail.com' },
      });

      if (!existingAdmin) {
        // Create admin account using User model to trigger password hashing
        await User.create({
          username: 'admin1',
          email: 'myeveadmin@gmail.com',
          password: 'Admin123!', // Will be hashed by beforeCreate hook
          role: 'admin',
        });

        console.log('✅ Admin account created successfully!');
        console.log('📧 Email: myeveadmin@gmail.com');
        console.log('🔑 Password: Admin123!');
      } else {
        console.log('ℹ️  Admin account already exists');
      }
    } catch (error) {
      console.error('❌ Error creating admin account:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'myeveadmin@gmail.com' });
  },
};
