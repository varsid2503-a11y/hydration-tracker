const goal = 3500;
let current = localStorage.getItem('waterCount') ? parseInt(localStorage.getItem('waterCount')) : 0;
let lastResult = 0;

function updateUI() {
    const progressCircle = document.getElementById('progress-bar');
    const percentNum = document.getElementById('percent-num');
    const currentMLText = document.getElementById('current-ml');
    const remainMLText = document.getElementById('remain-ml');
    const statusText = document.getElementById('status-text');

    let percentage = Math.min((current / goal) * 100, 100);
    let offset = 565 - (565 * percentage) / 100;

    progressCircle.style.strokeDashoffset = offset;
    percentNum.innerText = Math.floor(percentage);
    currentMLText.innerText = current;
    remainMLText.innerText = Math.max(goal - current, 0) + "ml";

    if (percentage < 30) statusText.innerText = "Dehydrated";
    else if (percentage < 70) statusText.innerText = "Getting There";
    else if (percentage < 100) statusText.innerText = "Almost Hydrated";
    else statusText.innerText = "Fully Hydrated!";

    if (percentage >= 100 && lastResult < 100) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d4ff', '#ffffff', '#00ff88']
        });
    }

    lastResult = percentage;
    localStorage.setItem('waterCount', current);
}

function addWater(amount) {
    current += amount;
    updateUI();
}

function resetWater() {
    if(confirm("Reset today's progress?")) {
        current = 0;
        updateUI();
    }
}

document.getElementById('date-display').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
updateUI();
