const MAX_LIMIT = 4000;
let currentTotal = parseInt(localStorage.getItem('waterConsumed')) || 0;
let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 2000;
let reminderInterval = null;

document.getElementById('goal-input').value = dailyGoal;

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-btn').innerText = '☀️';
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    document.getElementById('dark-mode-btn').innerText = isDark ? '☀️' : '🌙';
}

function updateDisplay() {
    const goalInput = document.getElementById('goal-input');
    dailyGoal = parseInt(goalInput.value) || 2000;
    
    if (dailyGoal > MAX_LIMIT) {
        dailyGoal = MAX_LIMIT;
        goalInput.value = MAX_LIMIT;
    }

    localStorage.setItem('dailyGoal', dailyGoal);

    const percent = Math.min((currentTotal / dailyGoal) * 100, 100);
    document.getElementById('total-display').innerText = `${currentTotal}ml / ${dailyGoal}ml`;
    document.getElementById('progress-bar').style.width = percent + "%";
    
    const lastTime = localStorage.getItem('lastUpdatedTime');
    if (lastTime) {
        document.getElementById('last-updated').innerText = `Last drink at: ${lastTime}`;
    }

    if (currentTotal >= dailyGoal && currentTotal > 0) {
        document.getElementById('status-msg').innerText = "Goal Reached!";
        updateStreak();
        showVictory();
    } else {
        document.getElementById('status-msg').innerText = "Keep Drinking!";
    }
    
    checkBadges();
    renderStreak();
}

function addWater() {
    const amount = parseInt(document.getElementById('water-input').value);
    if (isNaN(amount) || amount <= 0) return;

    const sound = document.getElementById('splash-sound');
    if (sound) {
        sound.volume = 0.4;
        sound.currentTime = 0;
        sound.play();
    }

    currentTotal += amount;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    localStorage.setItem('waterConsumed', currentTotal);
    localStorage.setItem('lastUpdatedTime', timeString);
    
    updateDisplay();
    document.getElementById('water-input').value = '';
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastGoalDate = localStorage.getItem('lastGoalDate');
    let streak = parseInt(localStorage.getItem('streakCount')) || 0;

    if (lastGoalDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastGoalDate === yesterday.toDateString()) {
        streak++;
    } else {
        streak = 1;
    }

    localStorage.setItem('streakCount', streak);
    localStorage.setItem('lastGoalDate', today);
}

function renderStreak() {
    const streak = localStorage.getItem('streakCount') || 0;
    document.getElementById('streak-count').innerText = streak;
}

function handleReminderBtn() {
    const btn = document.getElementById('reminder-btn');
    if (reminderInterval) {
        stopReminders();
        btn.innerText = "Enable Reminders 🔔";
        btn.style.background = "#f39c12";
    } else {
        Notification.requestPermission().then(p => {
            if (p === "granted") {
                btn.innerText = "Disable Reminders 🔕";
                btn.style.background = "#e74c3c";
                startReminders();
            }
        });
    }
}

function startReminders() {
    if (reminderInterval) clearInterval(reminderInterval);
    reminderInterval = setInterval(() => {
        if (currentTotal < dailyGoal) {
            new Notification("Time to Hydrate! 💧", {
                body: "Take a sip to reach your goal!",
                icon: "icon.png" 
            });
        }
    }, 900000); 
}

function stopReminders() {
    clearInterval(reminderInterval);
    reminderInterval = null;
}

function resetTracker() {
    if (confirm("Reset everything?")) {
        currentTotal = 0;
        localStorage.setItem('waterConsumed', 0);
        localStorage.removeItem('lastUpdatedTime');
        document.getElementById('last-updated').innerText = "";
        updateDisplay();
    }
}

function checkBadges() {
    if (currentTotal > 0) document.getElementById('badge-sip').classList.add('unlocked');
    if (currentTotal >= dailyGoal && dailyGoal > 0) document.getElementById('badge-hero').classList.add('unlocked');
    if (currentTotal >= MAX_LIMIT) document.getElementById('badge-max').classList.add('unlocked');
}

async function fetchWaterFact() {
    const factElement = document.getElementById('water-fact');
    const spinner = document.getElementById('spinner');
    factElement.classList.add('hidden');
    spinner.classList.remove('hidden');
    try {
        const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const data = await res.json();
        factElement.innerText = data.text;
    } catch (e) {
        factElement.innerText = "Water is essential for life!";
    } finally {
        spinner.classList.add('hidden');
        factElement.classList.remove('hidden');
    }
}

function showVictory() {
    const modal = document.getElementById('victory-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}

function closeVictory() {
    document.getElementById('victory-modal').classList.add('hidden');
}

function shareApp() {
    const streak = localStorage.getItem('streakCount') || 0;
    const shareData = {
        title: 'Hydration Tracker',
        text: `I've drunk ${currentTotal}ml today! My streak is ${streak} days!`,
        url: window.location.href
    };
    if (navigator.share) navigator.share(shareData);
    else alert("Link copied!");
}

function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

window.onload = () => {
    updateDisplay();
    fetchWaterFact();
    if (Notification.permission === "granted") startReminders();
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}