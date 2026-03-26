const app = document.getElementById('app');
let weight = localStorage.getItem('varsid_weight') || 0;
let intake = JSON.parse(localStorage.getItem('varsid_intake')) || [0,0,0,0,0,0,0];
let activityBonus = parseInt(localStorage.getItem('varsid_bonus')) || 0;

function init() {
    if (weight == 0) {
        app.innerHTML = `
            <h2>Setup Goal</h2>
            <p>Enter your weight to calculate your 35ml goal:</p>
            <input type="number" id="wInput" placeholder="Weight in kg">
            <button class="main-btn" onclick="saveW()">Calculate & Start</button>`;
        return;
    }

    const goal = (weight * 35) + activityBonus;
    const current = intake[new Date().getDay()];
    const percent = Math.min((current/goal)*100, 100).toFixed(0);

    app.innerHTML = `
        <h1>HydratePro</h1>
        <div class="fact-box"><strong>💡 Fact:</strong> Drinking water helps your brain focus during Math and Science!</div>
        
        <select onchange="setAct(this.value)" style="width:100%; padding:8px; margin-bottom:15px; border-radius:8px;">
            <option value="0" ${activityBonus==0?'selected':''}>Rest Day</option>
            <option value="500" ${activityBonus==500?'selected':''}>Active (+500ml)</option>
            <option value="1000" ${activityBonus==1000?'selected':''}>Match Day (+1000ml)</option>
        </select>

        <div class="stats-grid">
            <div class="stat-card"><small>Goal</small><div>${goal}ml</div></div>
            <div class="stat-card"><small>Logged</small><div>${current}ml</div></div>
        </div>

        <div style="font-size:2.5rem; font-weight:bold;">${percent}%</div>
        <input type="number" id="mlAdd" placeholder="ml to add">
        <button class="main-btn" onclick="addW()">Add Water</button>
        <button onclick="reset()" style="background:none; border:none; color:gray; font-size:0.7rem; margin-top:15px; cursor:pointer;">Reset Weight</button>
        <canvas id="chart"></canvas>

        <div id="successModal" onclick="this.style.display='none'">
            <div style="background:var(--card); padding:30px; border-radius:20px; border:2px solid var(--primary); text-align:center;">
                <div style="font-size:3rem;">🏆</div><h2>Goal Reached!</h2><p>Tap to close</p>
            </div>
        </div>`;
    renderChart();
}

function saveW() {
    const val = document.getElementById('wInput').value;
    if(val > 0) { weight = val; localStorage.setItem('varsid_weight', val); init(); }
}

function addW() {
    const val = parseInt(document.getElementById('mlAdd').value);
    const day = new Date().getDay();
    const goal = (weight * 35) + activityBonus;
    if(!val) return;
    intake[day] += val;
    if(intake[day] >= goal) { 
        document.getElementById('successModal').style.display='flex'; 
        confetti();
    }
    localStorage.setItem('varsid_intake', JSON.stringify(intake));
    init();
}

function setAct(v) { activityBonus = parseInt(v); localStorage.setItem('varsid_bonus', v); init(); }
function reset() { localStorage.clear(); location.reload(); }

function renderChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', data: { labels: ['S','M','T','W','T','F','S'],
        datasets: [{ data: intake, backgroundColor: '#00b4d8', borderRadius: 5 }]},
        options: { plugins: { legend: { display: false }}, scales: { y: { display: false }}}
    });
}

init();