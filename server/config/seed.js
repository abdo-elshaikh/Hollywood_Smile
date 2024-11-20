const User = require('../models/User');
const logger = require('../utils/logger');
const config = require('../utils/config');


const seedAdmin = async () => {
    try {
        const admin = await User.findOne({ email: config.ADMIN_EMAIL });
        if (!admin) {
            await User.create({
                username: config.ADMIN_USERNAME,
                email: config.ADMIN_EMAIL,
                password: config.ADMIN_PASSWORD,
                role: 'admin',
                isActive: true,
                name: 'Administrator'
            });
            logger.info('Admin user created');
        } else {
            logger.info('Admin user already exists');
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`);
    }
}

module.exports = seedAdmin;
