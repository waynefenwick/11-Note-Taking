const express = require('express'); // framework with features and utilities for building web apps
const path = require('path'); // node.js module that works with directory paths
const fs = require('fs'); // 'file system' node.js module that offers file management functions
const uuid = require('../helper/uuid'); // module that assigns 'universal unique identifiers' to saved notes
const cors = require ('cors'); // a middleware module that enables cross-origin communication and resource sharing between different domains.

const app = express();

// Set the public folder as a static directory
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Gets route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// api/notes refers to the db.json file
// Gets notes stored in db.json
app.get('/api/notes', (req, res) => {
  console.log("app.get('/api/notes') called");
  fs.readFile(path.join('/Users/waynefenwick/Bootcamp/Class-Challenges/11-Note-Taking/db/db.json'), 'utf8', (err, data) => {
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
  const newNote = req.body;
  newNote.id = uuid();
  fs.readFile(path.join('/Users/waynefenwick/Bootcamp/Class-Challenges/11-Note-Taking/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile(path.join('/Users/waynefenwick/Bootcamp/Class-Challenges/11-Note-Taking/db/db.json'), JSON.stringify(notes), 'utf8', (err) => {
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
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    try {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes), 'utf8', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete note.' });
    }
      res.sendStatus(204);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

module.exports = app;