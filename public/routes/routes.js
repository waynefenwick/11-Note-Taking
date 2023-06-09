const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Sets route for homepage
router.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'index.html'), {
          headers: {
               'Content-Type': 'text/html',
          },
     });
});

// Sets route for 'notes' page
router.get('/notes', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'notes.html'), {
          headers: {
               'Content-Type': 'text/html',
          },
     });
});

// Sets route for styles
router.get('/css/styles.css', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'css', 'styles.css'));
});

// Sets route to stored data in db.json
const notesFilePath = path.join(__dirname, '..', '..', 'db', 'db.json');

// GET saved data
router.get('/api/notes', (req, res) => {
     console.log('GET Called');
     fs.readFile(notesFilePath, 'utf8', (err, data) => {
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

// Adds a unique id to each posted piece of data
const { v4: uuidv4 } = require('uuid');

// POST (save) data
router.post('/api/notes', (req, res) => {
     fs.readFile(notesFilePath, 'utf8', (err, data) => {
          if (err) {
               console.error(err);
               return res.status(500).json({ error: 'Failed to read notes.' });
          }
          try {
               const notes = JSON.parse(data);
               const newNote = {
                    id: uuidv4(),
                    ...req.body,
               };
               const updatedNotes = [...notes, newNote];
               fs.writeFile(notesFilePath, JSON.stringify(updatedNotes), 'utf8', (err) => {
                    if (err) {
                         console.error(err);
                         return res.status(500).json({ error: 'Failed to save note.' });
                    }
                    res.status(201).json(newNote);
               });
          } catch (error) {
               console.error(error);
               res.status(500).json({ error: 'Failed to parse notes data.' });
          }
     });
});

// DELETE posted data
router.delete('/api/notes/:id', (req, res) => {
     const noteId = req.params.id;
     fs.readFile(notesFilePath, 'utf8', (err, data) => {
          if (err) {
               console.error(err);
               return res.status(500).json({ error: 'Failed to read notes.' });
          }
          try {
               const notes = JSON.parse(data);
               const updatedNotes = notes.filter((note) => note.id !== noteId);
               fs.writeFile(notesFilePath, JSON.stringify(updatedNotes), 'utf8', (err) => {
                    if (err) {
                         console.error(err);
                         return res.status(500).json({ error: 'Failed to delete note.' });
                    }
                    res.status(200).json({ message: 'Note deleted successfully.' });
               });
          } catch (error) {
               console.error(error);
               res.status(500).json({ error: 'Failed to parse notes data.' });
          }
     });
});

module.exports = router;
