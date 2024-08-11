const { sequelize, Problem, Contest, Leaderboard } = require('./models');

const initializeDatabase = async () => {
    try {
        console.log('Synchronizing database...');
        await sequelize.sync({ force: true });  // Recreate tables if they already exist

        // Optionally, you can seed some initial data here
        console.log('Database synchronized successfully.');

        // Example data seeding (optional)
        await Problem.bulkCreate([
            {
                title: 'Sum of Two Numbers',
                description: 'Given two numbers, return their sum.',
                constraints: 'Input numbers should be integers.',
                testCases: JSON.stringify(['Input: 2 3', 'Output: 5'])
            },
            {
                title: 'Palindrome Checker',
                description: 'Check if a given string is a palindrome.',
                constraints: 'Input string should not exceed 100 characters.',
                testCases: JSON.stringify(['Input: racecar', 'Output: true'])
            }
        ]);

        await Contest.bulkCreate([
            {
                title: 'Code Challenge 1',
                description: 'A contest to solve basic coding problems.',
                startTime: new Date(Date.now() + 1000 * 60 * 60),  // Starts in 1 hour
                endTime: new Date(Date.now() + 1000 * 60 * 120)  // Ends in 2 hours
            }
        ]);

        await Leaderboard.bulkCreate([
            { username: 'user1', score: 100 },
            { username: 'user2', score: 80 },
            { username: 'user3', score: 60 }
        ]);

        console.log('Initial data seeded successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        process.exit();  // Exit the process after initialization
    }
};

// Run the database initialization
initializeDatabase();
