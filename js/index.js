console.log('Server is running and listening to the port');

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Pathway to notes.html elements
console.log('pathname:', window.location.pathname);
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group-item');
};

// Shows & hide elements
const show = (elem) => {
  elem.style.display = 'inline';
};
const hide = (elem) => {
  elem.style.display = 'none';
};

// Keeps track of the note in the textarea
let activeNote = {};

// GET, POST and DELETE nots from db.json
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
  fetch(`/api/notes${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Selected saved note
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

// Saves the note to the notesLIst
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

// Deletes the note selected to be deleted
const handleNoteDelete = (e) => {
// Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
      activeNote = {};

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// If no note text, the the save button is hidden
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  console.log(jsonNotes)
  console.log('pathname:', window.location.pathname);
  if (window.location.pathname === '/notes') {
    console.log('noteList:', noteList);
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];
  console.log('noteListItems:', noteListItems)
  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    console.log('Text:', text);
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
    console.log('liEl:', liEl);
    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    console.log('Note:', note);
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });
  console.log('pathname:', window.location.pathname);
  if (window.location.pathname === '/notes') {
    console.log('noteList:', noteList);
    noteListItems.forEach((note) => noteList[0].append(note));
    console.log('noteListItems:', noteListItems);
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);
console.log('pathname:', window.location.pathname);
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();