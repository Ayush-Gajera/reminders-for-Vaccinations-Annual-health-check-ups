document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('reminderForm');
    const addBtn = document.getElementById('addNewBtn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const form = document.getElementById('newReminderForm');

    // Load existing reminders from localStorage
    loadReminders();

    addBtn.onclick = () => {
        modal.style.display = "block";
    }

    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        
        const title = document.getElementById('reminderTitle').value;
        const type = document.getElementById('reminderType').value;
        const date = document.getElementById('reminderDate').value;

        addReminder(title, type, date);
        
        modal.style.display = "none";
        form.reset();
    }

    // Update countdowns every second
    setInterval(updateCountdowns, 1000);
});

function addReminder(title, type, date) {
    const reminder = {
        title,
        type,
        date,
        id: Date.now()
    };

    // Save to localStorage
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Add to DOM
    createReminderCard(reminder);
}

function createReminderCard(reminder) {
    const card = document.createElement('div');
    card.className = 'reminder-card';
    card.id = `reminder-${reminder.id}`;
    
    card.innerHTML = `
        <h3>${reminder.title}</h3>
        <p>Due date: ${new Date(reminder.date).toLocaleDateString()}</p>
        <div class="countdown" data-date="${reminder.date}"></div>
        <button class="remind-btn" onclick="deleteReminder(${reminder.id})">Delete</button>
    `;

    const section = reminder.type === 'vaccination' 
        ? document.getElementById('vaccinationSection')
        : document.getElementById('checkupSection');
    
    section.appendChild(card);
    updateCountdown(card.querySelector('.countdown'));
}

function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.forEach(reminder => createReminderCard(reminder));
}

function deleteReminder(id) {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    const updatedReminders = reminders.filter(r => r.id !== id);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    
    document.getElementById(`reminder-${id}`).remove();
}

function updateCountdowns() {
    document.querySelectorAll('.countdown').forEach(updateCountdown);
}

function updateCountdown(element) {
    const targetDate = new Date(element.dataset.date);
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        element.textContent = `Time remaining: ${days} days, ${hours} hours`;
    } else {
        element.textContent = 'Due date has passed!';
        element.style.color = '#e74c3c';
    }
}