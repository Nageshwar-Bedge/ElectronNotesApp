const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notesList');
    const noteText = document.getElementById('noteText');
    const saveButton = document.getElementById('saveButton');
    const noteTitle = document.getElementById('noteTitle'); // Reference to the note title header
    let selectedNoteIndex = null; // Track the index of the selected note

    // Load and display saved notes on startup
    async function loadNotes() {
        const notes = await ipcRenderer.invoke('load-notes');
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.innerText = `Note ${index + 1}`;
            noteItem.className = 'note-item';
            noteItem.addEventListener('click', () => {
                noteText.value = note;
                noteTitle.innerText = `Note ${index + 1}`; // Set the note title when selected
                highlightSelectedNote(index); // Highlight the selected note
                selectedNoteIndex = index; // Store the selected index
            });
            notesList.appendChild(noteItem);
        });
    }

    function highlightSelectedNote(index) {
        const noteItems = notesList.getElementsByClassName('note-item');
        for (let i = 0; i < noteItems.length; i++) {
            if (i === index) {
                noteItems[i].style.backgroundColor = '#d1e7dd'; // Change to a light green color for the selected note
            } else {
                noteItems[i].style.backgroundColor = ''; // Reset other notes
            }
        }
    }

    // Save the current note
    saveButton.addEventListener('click', async () => {
        const note = noteText.value;
        if (note.trim()) {
            await ipcRenderer.invoke('save-note', note);
            loadNotes();
            noteText.value = ''; // Clear text area after saving
            noteTitle.innerText = 'New Note'; // Reset title
            selectedNoteIndex = null; // Reset selected note index
        }
    });

    loadNotes(); // Initial load of notes
});
