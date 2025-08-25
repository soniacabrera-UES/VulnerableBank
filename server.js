// server.js
// Main application file for VulnerableBank
//
const express = require('express');
const path = require('path');
const db = require('./database.js');
const app = express();
const PORT = process.env.PORT || 3000;

// --- VULNERABILITY FOR GITGUARDIAN ---
// A developer accidentally left a hardcoded secret here.
const OLD_DB_CONNECTION_STRING = "postgres://admin:supersecretpassword123!@db.legacy.vulnerable.bank/prod";
// -----------------------------------------
// -----------------------------------------

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Login route with a SQL Injection vulnerability
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // --- VULNERABILITY FOR OWASP ZAP (SQL Injection) ---
  // The query is built by concatenating user input directly.
  // An attacker can use an input like: ' OR 1=1 --
  // This bypasses the password check.
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log(`Executing vulnerable query: ${query}`);
  // ----------------------------------------------------

  db.get(query, [], (err, user) => {
    if (err) {
      return res.status(500).send("Server error");
    }
    if (user) {
      // Pass the username to the dashboard for the XSS vulnerability
      res.render('dashboard', { 
        username: user.username,
        balance: user.balance.toFixed(2) 
      });
    } else {
      res.render('login', { error: 'Invalid username or password.' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`VulnerableBank server running on http://localhost:${PORT}`);
});


