// Elements
const addBtn = document.querySelector('.submit-button');
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('#taskList');
const resetBtn = document.querySelector('.reset-button');
const calStrip = document.querySelector('#calendarStrip');
const selectedDateLabel = document.querySelector('#selectedDateLabel');
const prevBtn = document.querySelector('.cal-nav.prev');
const nextBtn = document.querySelector('.cal-nav.next');

// Date utils
const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const fromYMD = (s) => {
    const [y,m,d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
};
const addDays = (d, n) => {
    const dd = new Date(d);
    dd.setDate(dd.getDate() + n);
    return dd;
};
const diffInDays = (a, b) => { // a >= b
    const A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((A - B) / 86400000);
};

// Storage
function getHabits() {
    try { return JSON.parse(localStorage.getItem('habits') || '[]'); } catch { return []; }
}
function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// State
const today = new Date();
let state = {
    selectedDate: toYMD(today),
    weekStart: toYMD(addDays(today, -3)), // center today in 7-day strip
    habits: []
};

// Migration: legacy habits [{text, completed}] -> new format
function migrate(habits) {
    const isLegacy = Array.isArray(habits) && habits.some(h => h && 'completed' in h && !('progress' in h));
    if (!isLegacy) return habits;
    const t = toYMD(new Date());
    return habits.map((h, idx) => ({
        id: `h_${Date.now()}_${idx}`,
        text: h.text || 'Habit',
        startDate: t,
        durationDays: 1,
        progress: { [t]: !!h.completed }
    }));
}

function loadState() {
    const raw = getHabits();
    state.habits = migrate(raw);
    saveHabits(state.habits); // persist migrated
}

// Calendar rendering
function renderCalendar() {
    const start = fromYMD(state.weekStart);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    calStrip.innerHTML = '';
    const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const sel = state.selectedDate;
    const todayStr = toYMD(new Date());

    days.forEach((d) => {
        const ymd = toYMD(d);
        const div = document.createElement('div');
        div.className = 'cal-day' + (ymd === sel ? ' selected' : '') + (ymd === todayStr ? ' today' : '');
        div.dataset.date = ymd;
        div.innerHTML = `
            <span class="dow">${dow[d.getDay()]}</span>
            <span class="dom">${d.getDate()}</span>
            <span class="month">${mos[d.getMonth()]}</span>
        `;
        div.addEventListener('click', () => {
            state.selectedDate = ymd;
            // if clicked outside current 7, adjust weekStart
            const curStart = fromYMD(state.weekStart);
            const curEnd = addDays(curStart, 6);
            if (d < curStart) state.weekStart = toYMD(addDays(d, -3));
            if (d > curEnd) state.weekStart = toYMD(addDays(d, -3));
            render();
        });
        calStrip.appendChild(div);
    });

    const selD = fromYMD(state.selectedDate);
    selectedDateLabel.textContent = `${dow[selD.getDay()]}, ${selD.getDate()} ${mos[selD.getMonth()]} ${selD.getFullYear()}`;
}

// Habit helpers
function isHabitActiveOn(habit, ymd) {
    const d = fromYMD(ymd);
    const start = fromYMD(habit.startDate);
    const daysFromStart = diffInDays(d, start);
    return daysFromStart >= 0 && daysFromStart < habit.durationDays;
}

function renderTasks() {
    taskList.innerHTML = '';
    const ymd = state.selectedDate;
    const visibleHabits = state.habits.filter(h => isHabitActiveOn(h, ymd));
    visibleHabits.forEach((habit) => {
        const li = document.createElement('li');
        li.className = 'habit-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'habit-checkbox';
        checkbox.checked = !!(habit.progress && habit.progress[ymd]);
        checkbox.addEventListener('change', () => {
            habit.progress = habit.progress || {};
            habit.progress[ymd] = checkbox.checked;
            saveHabits(state.habits);
            updateProgress();
        });

        const text = document.createElement('span');
        text.className = 'habit-text';
        text.textContent = habit.text;

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = '\u00d7';
        del.addEventListener('click', () => {
            state.habits = state.habits.filter(h => h.id !== habit.id);
            saveHabits(state.habits);
            render();
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(del);
        taskList.appendChild(li);
    });
}

function calculateProgress() {
    const total = taskList.querySelectorAll('.habit-item').length;
    if (total === 0) return 0;
    const done = taskList.querySelectorAll('.habit-checkbox:checked').length;
    return Math.round((done / total) * 100);
}

function updateProgress() {
    const percentage = calculateProgress();
    const percentageElement = document.querySelector('.percentage');
    const circularProgress = document.querySelector('.circular-progress');
    percentageElement.textContent = percentage + '%';
    circularProgress.setAttribute('data-percentage', String(percentage));
    const progressColor = '#2e7d32';
    const bgColor = '#f5f5dc';
    circularProgress.style.background = `conic-gradient(${progressColor} ${percentage * 3.6}deg, ${bgColor} 0deg)`;
}

function render() {
    renderCalendar();
    renderTasks();
    updateProgress();
}

// Add habit with duration prompt
function addHabit() {
    const name = taskInput.value.trim();
    if (!name) return;
    const daysStr = prompt('For how many days do you want to maintain this habit?', '7');
    if (daysStr === null) return; // cancelled
    const duration = Math.max(1, parseInt(daysStr, 10) || 0);
    const habit = {
        id: `h_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        text: name,
        startDate: state.selectedDate, // start from selected date
        durationDays: duration,
        progress: {}
    };
    state.habits.push(habit);
    saveHabits(state.habits);
    taskInput.value = '';
    render();
}

// Events
addBtn.addEventListener('click', addHabit);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addHabit(); });
resetBtn.addEventListener('click', () => {
    // Clear all data
    state.habits = [];
    saveHabits(state.habits);
    render();
});
prevBtn.addEventListener('click', () => {
    const start = fromYMD(state.weekStart);
    state.weekStart = toYMD(addDays(start, -7));
    // Also move selected date back by 7 to stay in view
    state.selectedDate = toYMD(addDays(fromYMD(state.selectedDate), -7));
    render();
});
nextBtn.addEventListener('click', () => {
    const start = fromYMD(state.weekStart);
    state.weekStart = toYMD(addDays(start, 7));
    state.selectedDate = toYMD(addDays(fromYMD(state.selectedDate), 7));
    render();
});

// Init
window.addEventListener('load', () => {
    loadState();
    render();
});