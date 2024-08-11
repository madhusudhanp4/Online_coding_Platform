const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Create a Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite')
});

// Define Problem model
const Problem = sequelize.define('Problem', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    constraints: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    testCases: {
        type: DataTypes.TEXT,  // Store JSON as text
        allowNull: true
    }
});

// Define Contest model
const Contest = sequelize.define('Contest', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Define Leaderboard model
const Leaderboard = sequelize.define('Leaderboard', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Export the Sequelize instance and models
module.exports = { sequelize, Problem, Contest, Leaderboard };
