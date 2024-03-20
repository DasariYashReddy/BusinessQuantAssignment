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
const fs = require('fs');
const csv = require('csv-parser');


fs.createReadStream('cleaned_File_Final.csv')
    .pipe(csv())
    .on('data', (row) => {
        const insertQuery = 'INSERT INTO test (ticker,date,revenue,gp,fcf,capex) VALUES (?,?,?,?,?,?)';
        connection.query(insertQuery, [row.ticker, row.date, row.revenue, row.gp, row.fcf, row.capex], (err, result) => {
            if (err) {
                console.error('Error inserting row:', err);
                return;
            }
            console.log('Inserted row ID:', result.insertId);
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        connection.end(); // Close the database connection when done
    })
    .on('error', (err) => {
        console.error('Error processing CSV file:', err);
    });


