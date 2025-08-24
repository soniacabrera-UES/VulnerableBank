// database.js
// Sets up a simple in-memory SQLite database for the lab.

const sqlite3 = require('sqlite3').verbose();

// Use an in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

// Create users table and insert some dummy data
db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, balance REAL)');
  
  const insertStmt = db.prepare('INSERT INTO users (username, password, balance) VALUES (?, ?, ?)');
  insertStmt.run('admin', 'password123', 100000.00);
  insertStmt.run('alice', 'wonderland', 7500.50);
  insertStmt.run('bob', 'builder', 1234.25);
  insertStmt.finalize();

  console.log('Dummy users created.');
});

module.exports = db;
