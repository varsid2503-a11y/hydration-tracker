let currentTotal = parseInt(localStorage.getItem('currentTotal')) || 0;
const MAX_LIMIT = 4000;

window.onload = function() {
    updateDisplay();
    fetchFact();
    checkBadges();
};

function addWater() {
    const input = document.getElementById('water-input');
    const amount = parseInt(input.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    if ((currentTotal + amount) > MAX_LIMIT) {
        alert(`Limit Reached! You cannot exceed ${MAX_LIMIT}ml.`);
        return;
    }

    currentTotal += amount;
    input.value = '';
    updateDisplay();
    saveData();
    checkBadges();
}

function updateDisplay() {
    const goalInput = document.getElementById('goal-input');
    let goal = parseInt(goalInput.value);

    if (goal > MAX_LIMIT) {
        goal = MAX_LIMIT;
        goalInput.value = MAX_LIMIT;
    }

    const percent = Math.min((currentTotal / goal) * 100, 100);
    document.getElementById('total-display').innerText = `${currentTotal}ml / ${goal}ml`;
    document.getElementById('progress-bar').style.width = percent + "%";

    document.getElementById('status-msg').innerText = currentTotal >= goal ? "Goal Reached!" : "Keep Drinking!";
}

function checkBadges() {
    if (currentTotal > 0) document.getElementById('badge-first').classList.add('unlocked');
    const goal = parseInt(document.getElementById('goal-input').value);
    if (currentTotal >= goal) document.getElementById('badge-hero').classList.add('unlocked');
    if (currentTotal >= MAX_LIMIT) document.getElementById('badge-ocean').classList.add('unlocked');
}

function toggleHelp() {
    document.getElementById('help-modal').classList.toggle('hidden');
}

function resetTracker() {
    if (confirm("Reset everything?")) {
        currentTotal = 0;
        localStorage.setItem('currentTotal', 0);
        location.reload();
    }
}

function saveData() {
    localStorage.setItem('currentTotal', currentTotal);
}

async function fetchFact() {
    try {
        const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await res.json();
        if (data.text.length < 100) document.getElementById('water-fact').innerText = data.text;
    } catch (e) {
        document.getElementById('water-fact').innerText = "Water is life!";
    }
}

function toggleAchieveModal() {
    const modal = document.getElementById('achieve-modal');
    modal.classList.toggle('hidden');
}

function updateDisplay() {
    const goalInput = document.getElementById('goal-input');
    let goal = parseInt(goalInput.value);
    
    if (goal > MAX_LIMIT) {
        goal = MAX_LIMIT;
        goalInput.value = MAX_LIMIT;
    }

    const percent = Math.min((currentTotal / goal) * 100, 100);
    document.getElementById('total-display').innerText = `${currentTotal}ml / ${goal}ml`;
    document.getElementById('progress-bar').style.width = percent + "%";
    
    // Check for Victory!
    if (currentTotal >= goal && currentTotal > 0) {
        document.getElementById('status-msg').innerText = "Goal Reached!";
        showVictory();
    } else {
        document.getElementById('status-msg').innerText = "Keep Drinking!";
    }
}

function showVictory() {
    // 1. Show the Trophy Modal
    document.getElementById('victory-modal').classList.remove('hidden');

    // 2. Fire the Flower/Confetti Shower!
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#00bcd4', '#ff5252', '#8bc34a']
    });
}

function closeVictory() {
    document.getElementById('victory-modal').classList.add('hidden');
}