/* utilitas */
const $  = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const STORAGE_KEY = 'todos-amry';

/* state */
let todos         = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';          //  filter aktif

/* elemen DOM */
const todoForm   = $('#todo-form');
const todoInput  = $('#todo-input');
const todoDate   = $('#todo-date');
const todoBody   = $('#todo-body');
const deleteAll  = $('#delete-all');

/* dropdown filter */
const filterToggle  = $('#filter-toggle');   // tombol "Filter"
const filterOptions = $('#filter-options');  // panel <div> yg berisi 3 tombol filter

/* render tabel */
function renderTable() {
  todoBody.innerHTML = '';

  /* terapkan filter */
  const list = todos.filter(t =>
    currentFilter === 'all' ? true : t.status === currentFilter
  );

  if (!list.length) {
    todoBody.innerHTML =
      '<tr><td colspan="4" class="p-4 text-center text-slate-500">No task found</td></tr>';
    return;
  }

  list.forEach(todo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-3 ${todo.status === 'completed' ? 'status-completed' : ''}">${todo.text}</td>
      <td class="p-3">${todo.due}</td>
      <td class="p-3">
        <span class="${todo.status === 'pending' ? 'status-pending' : 'status-completed'} capitalize">
          ${todo.status}
        </span>
      </td>
      <td class="p-3 flex gap-2 justify-center">
        <button data-id="${todo.id}" data-action="edit"
          class="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600">✎</button>
        <button data-id="${todo.id}" data-action="toggle"
          class="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600">✔</button>
        <button data-id="${todo.id}" data-action="delete"
          class="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700">🗑</button>
      </td>
    `;
    todoBody.appendChild(tr);
  });
}

/* simpan ke localStorage */
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

/* tambah todo */
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  const due  = todoDate.value;
  if (!text || !due) return;

  todos.push({
    id: Date.now().toString(),
    text,
    due,
    status: 'pending',
  });

  save();
  renderTable();
  todoForm.reset();
});

/* tombl aksi di tabel */
todoBody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;

  const id     = btn.dataset.id;
  const action = btn.dataset.action;
  const todo   = todos.find(t => t.id === id);
  if (!todo) return;

  switch (action) {
    case 'edit':
      const newText = prompt('Edit task:', todo.text);
      if (newText !== null && newText.trim()) todo.text = newText.trim();
      break;
    case 'toggle':
      todo.status = todo.status === 'pending' ? 'completed' : 'pending';
      break;
    case 'delete':
      if (confirm('Delete this task?'))
        todos = todos.filter(t => t.id !== id);
      break;
  }
  save();
  renderTable();
});

/* filter dropdown  */
filterToggle.addEventListener('click', () => {
  filterOptions.classList.toggle('hidden');
});

/* delegasi klik ke 3 tombol filter */
filterOptions.addEventListener('click', e => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;

  currentFilter = btn.dataset.filter;   // 'all' | 'pending' | 'completed'
  filterOptions.classList.add('hidden');
  renderTable();
});

/* delete all */
deleteAll.addEventListener('click', () => {
  if (!todos.length) return;
  if (confirm('Delete ALL tasks?')) {
    todos = [];
    save();
    renderTable();
  }
});

/* init */
document.addEventListener('DOMContentLoaded', () => {
    // isi input tanggal default hari ini
  todoDate.value = new Date().toISOString().split('T')[0];
  renderTable();
});
