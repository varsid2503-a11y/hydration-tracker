let currentTotal = 0;
let dailyGoal = 1225;
let intakeLog = [];
let isFocusMode = false;
let reminderTimer = null;
let weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || [0, 0, 0, 0, 0, 0, 0];
let myChart = null;

window.onload = () => {
    loadData();
    updateUI();
    renderChart();
    startReminders();
};

function loadData() {
    const savedTotal = localStorage.getItem('currentTotal');
    const savedLog = localStorage.getItem('intakeLog');
    const savedWeight = localStorage.getItem('userWeight');
    const savedInterval = localStorage.getItem('reminderInterval');

    if (savedTotal) currentTotal = parseInt(savedTotal);
    if (savedLog) intakeLog = JSON.parse(savedLog);
    if (savedWeight) {
        document.getElementById('user-weight').value = savedWeight;
        dailyGoal = savedWeight * 35;
    }
    if (savedInterval) {
        document.getElementById('reminder-interval').value = savedInterval;
    }
}

function updateGoal() {
    const weight = document.getElementById('user-weight').value;
    dailyGoal = weight * 35;
    localStorage.setItem('userWeight', weight);
    updateUI();
}

function addWater(amount) {
    currentTotal += amount;
    intakeLog.push({ 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        amount: amount 
    });
    
    updateWeeklyData();
    saveData();
    updateUI();
    checkGoal();
}

function updateWeeklyData() {
    const today = new Date().getDay();
    weeklyData[today] = currentTotal;
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
    if (myChart) {
        myChart.data.datasets[0].data = weeklyData;
        myChart.update();
    }
}

function renderChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'ml Drank',
                data: weeklyData,
                backgroundColor: '#48cae4',
                borderRadius: 5,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#90e0ef', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#90e0ef', font: { size: 10 } } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function updateUI() {
    const percentage = Math.min(Math.floor((currentTotal / dailyGoal) * 100), 100);
    document.getElementById('percentage-text').innerText = percentage + "%";
    document.querySelector('.progress-circle').style.background = `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#00b4d8 ${percentage}%, #caf0f8 0%)`;
    document.getElementById('total-display').innerText = currentTotal + "ml";
    document.querySelector('.goal-text').innerText = `Goal: ${dailyGoal}ml`;

    const list = document.getElementById('history-list');
    list.innerHTML = intakeLog.slice(-3).reverse().map(item => `<li>Drank ${item.amount}ml at ${item.time}</li>`).join('');
}

function startReminders() {
    const mins = document.getElementById('reminder-interval').value || 15;
    if (reminderTimer) clearInterval(reminderTimer);
    reminderTimer = setInterval(showHydrationNotification, mins * 60 * 1000);
}

function updateReminders() {
    const mins = document.getElementById('reminder-interval').value;
    localStorage.setItem('reminderInterval', mins);
    startReminders();
}

function showHydrationNotification() {
    if (Notification.permission === "granted" && currentTotal < dailyGoal && !isFocusMode) {
        new Notification("Hydration Check!", { body: `Current: ${currentTotal}ml. Keep going!` });
    }
}

function saveData() {
    localStorage.setItem('currentTotal', currentTotal);
    localStorage.setItem('intakeLog', JSON.stringify(intakeLog));
}

function resetApp() {
    if (confirm("Reset today's progress?")) {
        currentTotal = 0;
        intakeLog = [];
        updateWeeklyData();
        saveData();
        updateUI();
    }
}

function checkGoal() {
    if (currentTotal >= dailyGoal) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        document.getElementById('victory-modal').classList.remove('hidden');
    }
}

function closeVictory() {
    document.getElementById('victory-modal').classList.add('hidden');
}

function toggleFocusMode() {
    isFocusMode = document.getElementById('focus-toggle').checked;
}