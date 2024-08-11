const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Joi = require('joi');  // Changed from 'joi' to 'Joi' for consistency
const {sequelize, Problem, Contest, Leaderboard } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

const api_url = '812f64c9.compilers.sphere-engine.com';
const api_token = 'f8f23cfc271ef5aab8ce34eff56a6af2';

// Validation schemas
const problemSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    constraints: Joi.string().required(),
    testCases: Joi.array().items(Joi.string()).required(),
});

const solveSchema = Joi.object({
    code: Joi.string().required(),
    problemId: Joi.number().required(),
});

// Fetch all problems
app.get('/api/problems', async (req, res) => {
    try {
        const problems = await Problem.findAll();
        res.json(problems);
    } catch (error) {
        res.status(500).send('Error fetching problems');
    }
});

// Create a new problem
app.post('/api/problems', async (req, res) => {
    const { error } = problemSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { title, description, constraints, testCases } = req.body;
    try {
        const newProblem = await Problem.create({
            title,
            description,
            constraints,
            testCases: JSON.stringify(testCases),
        });
        res.json(newProblem);
    } catch (error) {
        res.status(500).send('Error creating problem');
    }
});

// Fetch specific problem
app.get('/api/problems/:id', async (req, res) => {
    try {
        const problem = await Problem.findByPk(req.params.id);
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).send('Problem not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching problem');
    }
});

// Solve a problem
app.post('/api/solve', async (req, res) => {
    const { error } = solveSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { code, problemId } = req.body;
    try {
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            return res.status(404).send('Problem not found');
        }
        const data = {
            sourceCode: code,
            language: 'C++',
            input: problem.testCases[0].split(' ')[1],
        };
        const response = await axios.post(`${api_url}/submissions?access_token=${api_token}`, data);
        const result = response.data;

        // Polling for the result
        const submissionId = result.id;
        let submissionResult;
        do {
            const response = await axios.get(`${api_url}/submissions/${submissionId}?access_token=${api_token}`);
            submissionResult = response.data;
        } while (submissionResult.status !== 'done');

        res.json({
            output: submissionResult.output || 'No output',
            errors: submissionResult.stderr || 'No errors',
            time: submissionResult.time || '0',
            memory: submissionResult.memory || '0',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while executing the code');
    }
});

// Create a new contest
app.post('/api/contests', async (req, res) => {
    const { title, description, startTime, endTime } = req.body;
    try {
        const newContest = await Contest.create({ title, description, startTime, endTime });
        res.json(newContest);
    } catch (error) {
        res.status(500).send('Error creating contest');
    }
});

// Fetch all contests
app.get('/api/contests', async (req, res) => {
    try {
        const contests = await Contest.findAll();
        res.json(contests);
    } catch (error) {
        res.status(500).send('Error fetching contests');
    }
});

// Fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Leaderboard.findAll();
        res.json(leaderboard);
    } catch (error) {
        res.status(500).send('Error fetching leaderboard');
    }
});

// Server Initialization
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});


