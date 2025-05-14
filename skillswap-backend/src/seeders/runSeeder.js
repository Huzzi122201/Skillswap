require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./seeder');

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');
        await seedDatabase();
        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeder:', error);
        process.exit(1);
    }
};

runSeeder(); 