const express = require('express'); // framework with features and utilities for building web apps
const path = require('path'); // node.js module that works with directory paths
const fs = require('fs'); // 'file system' node.js module that offers file management functions
const uuid = require('../helper/uuid'); // module that assigns 'universal unique identifiers' to saved notes
const cors = require ('cors'); // a middleware module that enables cross-origin communication and resource sharing between different domains.

const app = express();

// Set the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Gets route for homepage
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'index.html'), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
});

app.get('/notes.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'notes.html'), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
});

// Serve the CSS file with the correct MIME type
app.get('/css/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'css', 'styles.css'));
});

app.get('/js/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'js', 'index.js'));
});



// Gets notes stored in db.json
app.get('/api/notes', (req, res) => {
  console.log("app.get('/api/notes') called");
  fs.readFile(path.join(__dirname, '..', 'db', 'db.json'), 'utf8', (err, data) => {
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

// Posts or adds notes to db.json
app.post('/api/notes', (req, res) => {
  console.log("app.post('/api/notes') called");
  fs.readFile(path.join(__dirname, '..', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      const newNote = req.body; // Assuming the new note data is in the request body
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(notes), 'utf8', (err) => {
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


// Deletes notes from db.json
app.delete('/api/notes/:id', (req, res) => {
  console.log("app.delete('/api/notes/:id') called");
  const noteId = req.params.id; // Assuming the note ID is provided as a URL parameter

  fs.readFile(path.join(__dirname, '..', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(updatedNotes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to delete note.' });
        }
        res.sendStatus(204); // No content response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

const PORT = process.env.PORT || 3001;
// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});