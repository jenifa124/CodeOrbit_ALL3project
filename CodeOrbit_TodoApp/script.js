// Task 2: localStorage-powered to-do list with create, edit, delete and complete.
const STORAGE_KEY = 'codeorbit_todo_tasks_v1';
const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const count = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
const clearCompleted = document.getElementById('clearCompleted');
let tasks = [];
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(stored)) tasks = stored.filter(t => t && typeof t.id === 'string' && typeof t.text === 'string').map(t => ({id:t.id,text:t.text,completed:!!t.completed}));
} catch (error) { console.warn('Could not read saved tasks:', error); }
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch (error) { alert('Unable to save tasks in this browser.'); console.error(error); }
}
function button(label, className, onClick) {
  const el = document.createElement('button');
  el.type = 'button'; el.textContent = label; el.className = className;
  el.addEventListener('click', onClick); return el;
}
function render() {
  list.replaceChildren();
  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark ' + task.text + ' complete');
    checkbox.addEventListener('change', () => { task.completed = checkbox.checked; save(); render(); });
    const text = document.createElement('span'); text.className = 'task-text'; text.textContent = task.text;
    const actions = document.createElement('div'); actions.className = 'actions';
    actions.append(
      button('Edit', '', () => {
        const updated = prompt('Edit your task:', task.text);
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed || trimmed.length > 150) { alert('Task must be 1–150 characters.'); return; }
        task.text = trimmed; save(); render();
      }),
      button('Delete', 'delete', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); })
    );
    li.append(checkbox, text, actions); list.append(li);
  });
  const remaining = tasks.filter(t => !t.completed).length;
  count.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
  emptyState.hidden = tasks.length > 0;
  clearCompleted.disabled = !tasks.some(t => t.completed);
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({id:crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),text,completed:false});
  input.value = ''; save(); render(); input.focus();
});
clearCompleted.addEventListener('click', () => { tasks = tasks.filter(t => !t.completed); save(); render(); });
render();
