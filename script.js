(()=> {
  'use strict';

  const el = id => document.getElementById(id);
  const input = el('new-task');
  const addBtn = el('add-btn');
  const list = el('task-list');
  const count = el('task-count');
  const clearCompleted = el('clear-completed');
  const filters = document.querySelectorAll('.filter');

  let tasks = JSON.parse(localStorage.getItem('ml_tasks') || '[]');
  let filter = 'all';

  function save() { localStorage.setItem('ml_tasks', JSON.stringify(tasks)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function render() {
    list.innerHTML = '';
    const visible = tasks.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'active') return !t.done;
      return t.done;
    });

    visible.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task';
      li.dataset.id = task.id;

      const cb = document.createElement('button');
      cb.className = 'checkbox' + (task.done ? ' checked' : '');
      cb.setAttribute('aria-pressed', String(task.done));
      cb.title = task.done ? 'Mark as active' : 'Mark as completed';
      cb.addEventListener('click', () => toggleDone(task.id));

      const title = document.createElement('div');
      title.className = 'task-title' + (task.done ? ' completed' : '');
      title.textContent = task.text;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const del = document.createElement('button');
      del.className = 'icon-btn';
      del.innerHTML = '🗑️';
      del.title = 'Delete task';
      del.addEventListener('click', () => removeTask(task.id));

      actions.appendChild(del);
      li.appendChild(cb);
      li.appendChild(title);
      li.appendChild(actions);
      list.appendChild(li);
    });

    count.textContent = tasks.length;
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.unshift({ id: uid(), text: trimmed, done: false });
    save(); render();
  }

  function toggleDone(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    save(); render();
  }

  function removeTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    save(); render();
  }

  function clearDone() {
    tasks = tasks.filter(x => !x.done);
    save(); render();
  }

  addBtn.addEventListener('click', () => { addTask(input.value); input.value = ''; input.focus(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { addTask(input.value); input.value = ''; } });
  clearCompleted.addEventListener('click', () => clearDone());

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      render();
    });
  });

  // Initial render
  render();

  // Debugging API
  window.TodoApp = { get tasks(){ return tasks }, addTask, removeTask, toggleDone };
})();
