console.log('I am Loading');

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let listContainer; // Declare listContainer variable

if (window.location.pathname === '/Class-Challenges/11-Note-Taking/public/notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note-btn');
  newNoteBtn = document.querySelector('.new-note-btn');
  listContainer = document.querySelector('.list-container .list-group'); // Assign listContainer
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('http://127.0.0.1:3001/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });


const saveNote = (note) =>
  fetch('http://127.0.0.1:3001/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`http://127.0.0.1:3001/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

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

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  if (e.target.classList.contains('delete-note')) {
    const note = e.target.parentElement.parentElement;
    const noteId = JSON.parse(note.dataset.note).id;

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const listItem = e.target.closest('li');
  if (listItem) {
    activeNote = JSON.parse(listItem.dataset.note);
    renderActiveNote();
  }
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    console.log('Hiding save button');
    hide(saveNoteBtn);
  } else {
    console.log('Showing save button');
    show(saveNoteBtn);
  }
};

// Create a list item element for a note
const createLi = (note) => {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');

  const noteTitleContainer = document.createElement('div');
  noteTitleContainer.classList.add('note-title-container');

  const noteTitle = document.createElement('span');
  noteTitle.textContent = note.title;

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-note');
  deleteIcon.setAttribute('data-note-id', note.id);

  noteTitleContainer.appendChild(noteTitle);
  noteTitleContainer.appendChild(deleteIcon);

  listItem.appendChild(noteTitleContainer);

  return listItem;
};

const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  const listContainer = document.querySelector('.list-container');

  // Clear the note list container
  listContainer.innerHTML = '';

  if (jsonNotes.length === 0) {
    const noNotesItem = document.createElement('li');
    noNotesItem.classList.add('list-group-item');
    noNotesItem.textContent = 'No saved Notes';
    listContainer.append(noNotesItem);
    return;
  }

  const noteList = document.createElement('ul');
  noteList.classList.add('list-group');

  jsonNotes.forEach((note) => {
    const listItem = createLi(note);
    listItem.dataset.note = JSON.stringify(note);

    const deleteIcon = listItem.querySelector('.delete-note');
    deleteIcon.addEventListener('click', handleNoteDelete);

    noteList.append(listItem);
  });

  listContainer.append(noteList);

  listContainer.addEventListener('click', handleNoteView);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/Class-Challenges/11-Note-Taking/public/notes.html') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  listContainer.addEventListener('click', handleNoteDelete); // Add this line
}

getAndRenderNotes();