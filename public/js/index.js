console.log('Server is running and listening to the port!');

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Pathway to notes.html elements
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-container .list-group');
}

// Shows & hides elements
const show = (elem) => {
  elem.style.display = 'inline';
};
const hide = (elem) => {
  elem.style.display = 'none';
};

// Keeps track of the note in the textarea
let activeNote = {};

// GET, POST and DELETE notes from db.json
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Saved notes
const renderActiveNote = () => {
  hide(saveNoteBtn);
  // If note is selected, is displayed in read only
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  // else, Note Title and Note Text fields are empty  
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// If no note text, the save button is hidden
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};
handleRenderSaveBtn();

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Saves the note to the notesList
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const noteData = e.target.parentElement.dataset.note;
  activeNote = noteData ? JSON.parse(noteData) : {};
  renderActiveNote();
};

// Deletes selected note
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.closest('li');
  const noteId = JSON.parse(note.dataset.note).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }
  deleteNote(noteId)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => {
      console.error('Error deleting note:', error);
    });
};

// Returns HTML element with or without a delete button
const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    delBtnEl.addEventListener('click', handleNoteDelete);

    liEl.append(delBtnEl);
  }
  return liEl;
};

// Renders the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.innerHTML = '';
  }
  if (jsonNotes.length === 0) {
    const emptyNoteLi = createLi('No saved Notes', false);
    noteList.append(emptyNoteLi);
  }
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteList.append(li);
  });
};

// Gets notes from the db and renders them to the notes list
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
