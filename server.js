const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'quiz_creator',
    password: '110401',
    port: 5433,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:3000' }));

// Serve static files and HTML pages
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Namepage.html'));
});

app.get('/test-taker', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'TestTaker.html'));
});



app.get('/all-results.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'allresults.html'));
});

app.get('/results.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'results.html'));
});




const createTableQuery = `
    CREATE TABLE IF NOT EXISTS quiz (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answers TEXT[] NOT NULL,
        correct_answer TEXT NOT NULL,
        version INTEGER DEFAULT 1
    );
`;

const createResultsTableQuery = `
    CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        correct_answers INTEGER NOT NULL,
        wrong_answers INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        version INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;


async function initializeDatabase() {
    try {
        await pool.query(createTableQuery);
        await pool.query(createResultsTableQuery);
        console.log('Tables created or already exist.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

initializeDatabase();

app.get('/api/quiz/new', async (req, res) => {
    try {
        const versionResult = await pool.query('SELECT MAX(version) AS latest_version FROM quiz');
        const latestVersion = versionResult.rows[0]?.latest_version;

        if (!latestVersion) {
            return res.json([]); // No quiz available
        }

        const result = await pool.query('SELECT * FROM quiz WHERE version = $1', [latestVersion]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching new questions:', error);
        res.status(500).send('Server error');
    }
});


app.post('/save', async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    try {
        const versionResult = await pool.query('SELECT MAX(version) AS latest_version FROM quiz');
        const latestVersion = versionResult.rows[0]?.latest_version || 0;
        const newVersion = latestVersion + 1;

        for (const question of questions) {
            const { question: questionText, answers, correctAnswer } = question;

            await pool.query(
                'INSERT INTO quiz (question, answers, correct_answer, version) VALUES ($1, $2, $3, $4)',
                [questionText, answers, correctAnswer, newVersion]
            );
        }

        res.json({ success: true, message: 'Quiz saved successfully', version: newVersion });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ success: false, message: 'Failed to save quiz' });
    }
});


app.post('/save-results', async (req, res) => {
    const { name, correctAnswers, wrongAnswers, totalQuestions, version } = req.body;

    if (!name || correctAnswers === undefined || wrongAnswers === undefined || totalQuestions === undefined || !version) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    try {
        await pool.query(
            'INSERT INTO results (name, correct_answers, wrong_answers, total_questions, version) VALUES ($1, $2, $3, $4, $5)',
            [name, correctAnswers, wrongAnswers, totalQuestions, version]
        );

        res.json({ success: true, message: 'Results saved successfully' });
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ success: false, message: 'Failed to save results' });
    }
});


app.get('/api/quiz/version', async (req, res) => {
    try {
        const result = await pool.query('SELECT MAX(version) AS latest_version FROM quiz');
        res.json({ latestVersion: result.rows[0]?.latest_version });
    } catch (error) {
        console.error('Error fetching quiz version:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/results/all', async (req, res) => {
    try {
        const versionResult = await pool.query('SELECT MAX(version) AS latest_version FROM quiz');
        const latestVersion = versionResult.rows[0]?.latest_version;

        if (!latestVersion) {
            return res.json([]); 
        }

        const result = await pool.query(
            'SELECT name, correct_answers, wrong_answers, total_questions, submitted_at FROM results WHERE version = $1 ORDER BY submitted_at DESC',
            [latestVersion]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Server error');
    }
});



app.get('/api/results/latest', async (req, res) => {
    const { name, version } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Name is required.' });
    }

    try {
        let query;
        let params;

        if (version) {
            query = `
                SELECT * FROM results 
                WHERE name = $1 AND version = $2 
                ORDER BY submitted_at DESC
            `;
            params = [name, version];
        } else {
            query = `
                SELECT * FROM results 
                WHERE name = $1 
                ORDER BY submitted_at DESC 
                LIMIT 1
            `;
            params = [name];
        }

        const result = await pool.query(query, params);

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({ message: 'No results found for this user.' });
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




