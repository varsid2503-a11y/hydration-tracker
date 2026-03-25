const app = document.getElementById('app');
let weight = localStorage.getItem('varsid_weight') || 60;
let intake = JSON.parse(localStorage.getItem('varsid_intake')) || [0, 0, 0, 0, 0, 0, 0];
let lastDate = localStorage.getItem('varsid_last_date');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const now = new Date();
const todayDateString = now.toDateString();
const todayIndex = now.getDay();

if (lastDate !== todayDateString) {
    localStorage.setItem('varsid_last_date', todayDateString);
    localStorage.setItem('varsid_intake', JSON.stringify(intake));
}

function init() {
    const goal = weight * 35;
    const current = intake[todayIndex];
    const percent = Math.min((current / goal) * 100, 100).toFixed(0);

    app.innerHTML = `
        <h1>HydratePro</h1>
        <p style="opacity:0.7">${todayDateString}</p>
        <div class="stats-grid">
            <div class="stat-card"><h3>Goal</h3><p>${goal}ml</p></div>
            <div class="stat-card"><h3>Logged</h3><p>${current}ml</p></div>
        </div>
        <div style="font-size: 2.5rem; font-weight: bold; margin: 10px 0;">${percent}%</div>
        <input type="number" id="waterInput" placeholder="Add water (ml)">
        <button onclick="addWater()">Add Drink</button>
        <button onclick="toggleHistory()" style="background:rgba(255,255,255,0.1); margin-top:15px; font-size:0.8rem;">View Weekly History</button>
        <div id="historyLog" style="display:none; margin-top:15px; text-align:left; background:rgba(0,0,0,0.2); padding:15px; border-radius:10px;">
            ${intake.map((amt, i) => `<div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding:5px 0;">
                <span>${days[i]}</span><span>${amt}ml</span>
            </div>`).join('')}
        </div>
        <input type="number" id="weightInput" placeholder="Update weight (kg)" style="margin-top:25px;">
        <button onclick="updateWeight()" style="background:none; border:1px solid var(--border); color:var(--text); font-size:0.8rem;">Update Profile</button>
        <canvas id="chart"></canvas>
    `;
    renderChart();
}

function addWater() {
    const input = document.getElementById('waterInput');
    const val = parseInt(input.value);
    if (val) {
        const goal = weight * 35;
        const before = intake[todayIndex];
        intake[todayIndex] += val;
        if (before < goal && intake[todayIndex] >= goal) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
        localStorage.setItem('varsid_intake', JSON.stringify(intake));
        init();
    }
}

function toggleHistory() {
    const log = document.getElementById('historyLog');
    log.style.display = log.style.display === 'none' ? 'block' : 'none';
}

function updateWeight() {
    const val = document.getElementById('weightInput').value;
    if (val) {
        weight = val;
        localStorage.setItem('varsid_weight', weight);
        init();
    }
}

function renderChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            datasets: [{
                label: 'ml',
                data: intake,
                backgroundColor: intake.map((_, i) => i === todayIndex ? '#00b4d8' : 'rgba(202, 240, 248, 0.3)'),
                borderRadius: 8
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#caf0f8' } } }
        }
    });
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/hydration-tracker/sw.js')
      .then(reg => console.log('SW Registered'))
      .catch(err => console.log('SW Error', err));
  });
}