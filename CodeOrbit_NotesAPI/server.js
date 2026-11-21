// CodeOrbit Tech Task 3: Simple Notes REST API using Express and a JSON file.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');
app.use(express.json({limit: '10kb'}));

// Read notes from JSON storage. Create an empty store on first run.
function readNotes() {
  if (!fs.existsSync(DATA_FILE)) { fs.mkdirSync(path.dirname(DATA_FILE), {recursive:true}); fs.writeFileSync(DATA_FILE, '[]\n'); }
  const notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!Array.isArray(notes)) throw new Error('Invalid notes storage');
  return notes;
}
function writeNotes(notes) { fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2) + '\n'); }
function validTitle(title) { return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 150; }
function validContent(content) { return typeof content === 'string' && content.length <= 5000; }
const handle = fn => (req, res, next) => { try { fn(req, res); } catch (err) { next(err); } };

app.get('/', (req, res) => res.json({message:'CodeOrbit Notes API',endpoints:['GET /api/notes','GET /api/notes/:id','POST /api/notes','PUT /api/notes/:id','DELETE /api/notes/:id']}));

// GET: return all saved notes.
app.get('/api/notes', handle((req, res) => res.json(readNotes())));

// GET: return one note by ID.
app.get('/api/notes/:id', handle((req, res) => {
  const note = readNotes().find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({error:'Note not found'});
  res.json(note);
}));

// POST: create a new note.
app.post('/api/notes', handle((req, res) => {
  const {title, content = ''} = req.body || {};
  if (!validTitle(title) || !validContent(content)) return res.status(400).json({error:'Title must be 1-150 characters and content at most 5000 characters.'});
  const notes = readNotes();
  const note = {id:randomUUID(),title:title.trim(),content,createdAt:new Date().toISOString()};
  notes.push(note); writeNotes(notes); res.status(201).json(note);
}));

// PUT: update an existing note.
app.put('/api/notes/:id', handle((req, res) => {
  const {title, content = ''} = req.body || {};
  if (!validTitle(title) || !validContent(content)) return res.status(400).json({error:'Title must be 1-150 characters and content at most 5000 characters.'});
  const notes = readNotes(); const note = notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({error:'Note not found'});
  note.title = title.trim(); note.content = content; note.updatedAt = new Date().toISOString();
  writeNotes(notes); res.json(note);
}));

// DELETE: remove a note by ID.
app.delete('/api/notes/:id', handle((req, res) => {
  const notes = readNotes(); const filtered = notes.filter(n => n.id !== req.params.id);
  if (filtered.length === notes.length) return res.status(404).json({error:'Note not found'});
  writeNotes(filtered); res.status(204).send();
}));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({error:'Invalid JSON request body'});
  console.error(err); res.status(500).json({error:'Internal server error'});
});
if (require.main === module) app.listen(PORT, () => console.log(`Notes API running at http://localhost:${PORT}`));
module.exports = app;
