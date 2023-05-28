const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helper/uuid');
const cors = require ('cors');

const app = express();
const PORT = 3001;

// Set the public folder as a static directory
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors());

// GET route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for GET /api/notes
app.get('/api/notes', (req, res) => {
  console.log("app.get('/api/notes') called");
  // Read the db.json file
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

// API route for POST /api/notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid(); // Assign a unique ID to the new note

  // Read the db.json file
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      notes.push(newNote);

      // Write the updated notes array to the db.json file
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save note.' });
        }

        res.json(newNote);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

// API route for DELETE /api/notes/:id
// API route for DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  // Read the db.json file
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    try {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      // Write the updated notes array to the db.json file
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete note.' });
        }

        res.sendStatus(204); // No content response (note successfully deleted)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
