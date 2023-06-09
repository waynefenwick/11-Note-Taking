const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Gets route for homepage
router.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'index.html'), {
          headers: {
               'Content-Type': 'text/html',
          },
     });
});

router.get('/notes', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'notes.html'), {
          headers: {
               'Content-Type': 'text/html',
          },
     });
});

// Serve the CSS file with the correct MIME type
router.get('/css/styles.css', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'css', 'styles.css'));
});

// Gets notes stored in db.json
const notesFilePath = path.join(__dirname, '..', '..', 'db', 'db.json');

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

// Posts or adds notes to db.json
const { v4: uuidv4 } = require('uuid');

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


// Deletes notes from db.json
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
