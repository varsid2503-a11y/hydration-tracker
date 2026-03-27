let totalWater = parseInt(localStorage.getItem('totalWater')) || 0;
const goal = 3500;

window.onload = function() {
    updateUI();
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric' 
        });
    }
};

window.addEventListener('keydown', (e) => {
    if (e.key === '1') addWater(250);
    if (e.key === '2') addWater(500);
    if (e.key === 'r' || e.key === 'R') resetWater();
});

function addWater(amount) {
    if (navigator.vibrate) navigator.vibrate(40);
    
    totalWater += amount;
    localStorage.setItem('totalWater', totalWater);
    updateUI();
    
    if (totalWater >= goal && (totalWater - amount) < goal) {
        triggerSuccess();
    }
}

function resetWater() {
    if (confirm("Reset today's progress?")) {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        totalWater = 0;
        localStorage.setItem('totalWater', 0);
        updateUI();
    }
}

function updateUI() {
    const percent = Math.min(Math.floor((totalWater / goal) * 100), 100);
    const remaining = Math.max(goal - totalWater, 0);
    
    document.getElementById('percent-num').innerText = percent;
    document.getElementById('current-ml').innerText = totalWater;
    document.getElementById('rem-ml').innerText = remaining + "ml";
    
    const offset = 565.48 - (565.48 * percent) / 100;
    document.getElementById('progress-ring').style.strokeDashoffset = offset;

    const statusText = document.getElementById('status-text');
    if (percent < 30) statusText.innerText = "Dehydrated";
    else if (percent < 70) statusText.innerText = "Getting There";
    else if (percent < 100) statusText.innerText = "Almost Hydrated";
    else statusText.innerText = "Goal Reached!";
}

function triggerSuccess() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d4ff', '#ffffff', '#00ff88']
    });
}
