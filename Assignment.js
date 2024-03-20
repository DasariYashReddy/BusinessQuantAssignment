const express = require('express');
const mysql = require('mysql');


// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'yashreddy', // Your MySQL password
    database: 'stocks'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create Express app
const app = express();


// Middleware to parse JSON bodies
app.use(express.json());

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Routes

app.get('*', (req, res) => {
    // Remove the leading slash and split the path into "key=value" pairs
    const queryParams = req.path.substring(1).split('&');
    let query
    // Object to hold the parsed parameters
    const params = {};

    // Loop through each "key=value" pair and populate the params object
    queryParams.forEach(param => {
        const [key, value] = param.split('=');
        // Only add the parameter if it's not empty
        if (key && value) {
            params[key] = decodeURIComponent(value);
        }
    });

    // Extract the specific parameters
    const { ticker, column, period } = params;

    // Respond with the parsed parameters
    const values = {
        ticker: ticker || null,
        column: column || null,
        period: period || null
    }
    if (values.period == null & values.column == null) {
        query = `SELECT * FROM financial_data2 WHERE ticker='${values.ticker}'`;
}
    else if (values.period === null & values.column !== null) {

        query = `SELECT ${values.column} FROM financial_data2 WHERE ticker='${values.ticker}'`;
    }
    else {
        let periodYears = parseInt(values.period[0]);
        query = `SELECT ${values.column} FROM financial_data2 WHERE ticker='${values.ticker}' AND date >= CURDATE() - INTERVAL ${periodYears} YEAR`;

    }
    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error', err);
            res.status(400);
            return;
        }
        res.status(200);
        res.send(result)
    });


console.log("Success")
});

