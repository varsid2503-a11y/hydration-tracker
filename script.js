const MAX_LIMIT = 4000;
let currentTotal = parseInt(localStorage.getItem('waterConsumed')) || 0;
let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 2000;

document.getElementById('goal-input').value = dailyGoal;

function updateDisplay() {
    const goalInput = document.getElementById('goal-input');
    dailyGoal = parseInt(goalInput.value);
    
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
        showVictory();
    } else {
        document.getElementById('status-msg').innerText = "Keep Drinking!";
    }
    
    checkBadges();
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

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Reminders enabled! I'll remind you every 30 minutes.");
            startReminders();
        }
    });
}

function startReminders() {
    setInterval(() => {
        if (currentTotal < dailyGoal) {
            new Notification("Time to Hydrate! 💧", {
                body: "You haven't reached your goal yet. Take a sip!",
                icon: "logo.png" 
            });
        }
    }, 1800000); 
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
    try {
        const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await res.json();
        document.getElementById('water-fact').innerText = data.text;
    } catch (e) {
        document.getElementById('water-fact').innerText = "Water is essential for all life!";
    }
}

function showVictory() {
    const modal = document.getElementById('victory-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#00bcd4', '#ff5252', '#8bc34a']
        });
    }
}

function closeVictory() {
    document.getElementById('victory-modal').classList.add('hidden');
}

function shareApp() {
    const shareData = {
        title: 'Hydration Tracker Pro',
        text: `I've drunk ${currentTotal}ml of water! Can you beat my goal?`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
}

function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

window.onload = () => {
    updateDisplay();
    fetchWaterFact();
    if (Notification.permission === "granted") {
        startReminders();
    }
};