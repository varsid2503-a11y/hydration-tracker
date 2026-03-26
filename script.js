const app = document.getElementById('app');
let intake = JSON.parse(localStorage.getItem('varsid_intake')) || [0, 0, 0, 0, 0, 0, 0];
let manualGoal = parseInt(localStorage.getItem('varsid_manual_goal')) || 0;
let activityBonus = parseInt(localStorage.getItem('varsid_bonus')) || 0;
let lastDate = localStorage.getItem('varsid_last_date');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const now = new Date();
const todayDateString = now.toDateString();
const todayIndex = now.getDay();

if (lastDate !== todayDateString) {
    localStorage.setItem('varsid_last_date', todayDateString);
    activityBonus = 0;
    localStorage.setItem('varsid_bonus', 0);
    localStorage.setItem('varsid_intake', JSON.stringify(intake));
}

function init() {
    if (manualGoal === 0) {
        renderSetup();
        return;
    }

    const totalGoal = manualGoal + activityBonus;
    const current = intake[todayIndex];
    const percent = Math.min((current / totalGoal) * 100, 100).toFixed(0);
    const isGoalReached = current >= totalGoal;

    app.innerHTML = `
        <h1>HydratePro</h1>
        <p style="opacity:0.7">${todayDateString}</p>
        
        <div style="margin-bottom:20px;">
            <select id="activityLevel" onchange="updateActivity()" style="width:100%; padding:10px; border-radius:8px; background:#1a1a1a; color:white; border:1px solid #333;">
                <option value="0" ${activityBonus === 0 ? 'selected' : ''}>Rest Day</option>
                <option value="500" ${activityBonus === 500 ? 'selected' : ''}>Active (+500ml)</option>
                <option value="1000" ${activityBonus === 1000 ? 'selected' : ''}>Athlete (+1000ml)</option>
            </select>
        </div>

        <div class="stats-grid">
            <div class="stat-card"><h3>Target</h3><p>${totalGoal}ml</p></div>
            <div class="stat-card"><h3>Logged</h3><p>${current}ml</p></div>
        </div>

        <div style="font-size: 2.5rem; font-weight: bold; margin: 10px 0;">${percent}%</div>
        
        <input type="number" id="waterInput" placeholder="ml to add" ${isGoalReached ? 'disabled' : ''}>
        
        <button id="addBtn" onclick="addWater()" 
            style="${isGoalReached ? 'background:#555; opacity:0.6;' : ''}" 
            ${isGoalReached ? 'disabled' : ''}>
            ${isGoalReached ? 'Goal Met!' : 'Add Water'}
        </button>

        <div id="successModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:100; align-items:center; justify-content:center;">
            <div style="background:#1a1a1a; padding:40px; border-radius:20px; border:2px solid #00b4d8; text-align:center; box-shadow: 0 0 20px rgba(0,180,216,0.5); width:80%; max-width:400px;">
                <div style="font-size:4rem; margin-bottom:10px;">🏆</div>
                <h2>Goal Smashed!</h2>
                <p>You hit 100% of your ${totalGoal}ml goal today!</p>
                
                <button onclick="shareSuccess()" style="width:100%; background:#25D366; color:white; margin-bottom:10px; display:flex; align-items:center; justify-content:center; gap:10px;">
                    <span>📤</span> Share Success
                </button>
                
                <button onclick="closeModal()" style="width:100%; background:none; border:1px solid #444; color:white;">Close</button>
            </div>
        </div>

        <button onclick="resetGoal()" style="background:none; border:1px solid #444; color:gray; font-size:0.7rem; margin-top:20px;">Recalculate Base Goal</button>
        <canvas id="chart"></canvas>
    `;
    renderChart();
}

function renderSetup() {
    app.innerHTML = `
        <div style="text-align:left; padding:20px;">
            <h2>Set Your Goal</h2>
            <p style="background:rgba(0,180,216,0.1); padding:15px; border-radius:10px; border-left:4px solid #00b4d8;">
                <strong>The Formula:</strong><br>
                Weight (kg) × 35 = Daily ml
            </p>
            <p>Calculate your needs and enter the total below:</p>
            <input type="number" id="newManualGoal" placeholder="e.g. 2100" style="width:100%; margin-bottom:15px;">
            <button onclick="setManualGoal()" style="width:100%;">Save My Goal</button>
        </div>
    `;
}

function setManualGoal() {
    const val = parseInt(document.getElementById('newManualGoal').value);
    if (val && val > 500) {
        manualGoal = val;
        localStorage.setItem('varsid_manual_goal', manualGoal);
        init();
    } else {
        alert("Enter a valid goal.");
    }
}

function resetGoal() {
    manualGoal = 0;
    localStorage.removeItem('varsid_manual_goal');
    init();
}

function updateActivity() {
    activityBonus = parseInt(document.getElementById('activityLevel').value);
    localStorage.setItem('varsid_bonus', activityBonus);
    init();
}

function addWater() {
    const input = document.getElementById('waterInput');
    const val = parseInt(input.value);
    const totalGoal = manualGoal + activityBonus;

    if (!val) return;

    if (intake[todayIndex] + val > totalGoal) {
        alert("Remaining: " + (totalGoal - intake[todayIndex]) + "ml");
        input.value = '';
        return;
    }

    intake[todayIndex] += val;
    
    if (intake[todayIndex] === totalGoal) {
        document.getElementById('successModal').style.display = 'flex';
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }

    localStorage.setItem('varsid_intake', JSON.stringify(intake));
    init();
}

function shareSuccess() {
    const totalGoal = manualGoal + activityBonus;
    const shareData = {
        title: 'HydratePro Goal Reached!',
        text: `I just hit my 100% hydration goal of ${totalGoal}ml on HydratePro! 🏆 Stay hydrated with me!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
        alert("Sharing is not supported on this browser. Copy the link manually!");
    }
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function renderChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    if(window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
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