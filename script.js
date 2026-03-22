let currentTotal = parseInt(localStorage.getItem('currentTotal')) || 0;
const MAX_DAILY_LIMIT = 4000;

window.onload = function() {
    updateDisplay();
    fetchFact();
};

async function fetchFact() {
    const factElement = document.getElementById('water-fact');
    const oldFact = localStorage.getItem('lastFact');
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await response.json();
        const newFact = data.text;
        if (newFact.length < 100 && newFact !== oldFact) {
            factElement.innerText = newFact;
            localStorage.setItem('lastFact', newFact);
        } else {
            fetchFact();
        }
    } catch (error) {
        factElement.innerText = "Water expands by 9% when it freezes into ice!";
    }
}

function addWater() {
    const inputField = document.getElementById('water-input');
    const amount = parseInt(inputField.value);
    const goal = parseInt(document.getElementById('goal-input').value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount of water! 💧");
        return;
    }

    if ((currentTotal + amount) > MAX_DAILY_LIMIT) {
        alert(`Safety Limit! You cannot track more than ${MAX_DAILY_LIMIT}ml per day.`);
        return;
    }

    currentTotal += amount;
    inputField.value = '';
    updateDisplay();
    saveData();
    checkBadges();
}

function updateDisplay() {
    const goal = parseInt(document.getElementById('goal-input').value);
    const percent = Math.min((currentTotal / goal) * 100, 100);
    
    document.getElementById('total-display').innerText = `${currentTotal}ml / ${goal}ml`;
    document.getElementById('progress-bar').style.width = percent + "%";

    if (currentTotal >= goal) {
        document.getElementById('status-msg').innerText = "Goal Reached! Stay Hydrated!";
    } else {
        document.getElementById('status-msg').innerText = "Keep Drinking!";
    }
}

function checkBadges() {
    if (currentTotal > 0) {
        document.getElementById('badge-first').classList.add('unlocked');
    }
    const goal = parseInt(document.getElementById('goal-input').value);
    if (currentTotal >= goal) {
        document.getElementById('badge-hero').classList.add('unlocked');
    }
    if (currentTotal >= 10000) {
        document.getElementById('badge-ocean').classList.add('unlocked');
    }
}

function resetTracker() {
    if (confirm("Are you sure you want to reset today's progress?")) {
        currentTotal = 0;
        updateDisplay();
        saveData();
        location.reload();
    }
}

function saveData() {
    localStorage.setItem('currentTotal', currentTotal);
}