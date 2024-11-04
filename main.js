const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: true,
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle saving and loading notes
ipcMain.handle('save-note', async (event, note) => {
    const notes = loadNotes();
    notes.push(note);
    saveNotes(notes);
});

ipcMain.handle('load-notes', async () => {
    return loadNotes();
});

function loadNotes() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'notes.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveNotes(notes) {
    fs.writeFileSync(path.join(__dirname, 'notes.json'), JSON.stringify(notes));
}
