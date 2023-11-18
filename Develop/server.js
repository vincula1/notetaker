const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading notes');
      } else {
        res.json(JSON.parse(data));
      }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
  
    // This is used to rread, update and write to the array.
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error saving note');
      } else {
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
          if (err) {
            res.status(500).send('Error saving note');
          } else {
            res.json(newNote);
          }
        });
      }
    });
});


// Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
