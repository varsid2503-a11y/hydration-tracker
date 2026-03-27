let totalWater = parseInt(localStorage.getItem('totalWater')) || 0;
let goal = 3500;
let currentTemp = null;
let isHeatMode = false;

window.onload = function() {
    fetchWeather();
    updateUI();
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    }
};

async function fetchWeather() {
    const city = 'London';
    const mockTemp = Math.floor(Math.random() * 20) + 20;
    currentTemp = mockTemp;

    adjustGoalForWeather(currentTemp);
    displayWeatherInfo(currentTemp, city);
}

function adjustGoalForWeather(temp) {
    const weatherInfo = document.getElementById('weather-info');
    const climateAlert = document.getElementById('climate-alert');
    const body = document.body;

    if (temp > 30) {
        goal = 4200;
        isHeatMode = true;
        body.classList.add('heat-mode');
        climateAlert.innerText = 'Heat Wave Alert';
        climateAlert.classList.remove('hidden');
        weatherInfo.innerHTML = `It's ${temp}°C today. Your goal has been adjusted for optimal hydration.`;
    } else {
        goal = 3500;
        isHeatMode = false;
        body.classList.remove('heat-mode');
        climateAlert.classList.add('hidden');
        weatherInfo.innerHTML = `It's ${temp}°C today. Stay hydrated!`;
    }

    document.getElementById('goal-display').innerText = goal;

    const storedWater = parseInt(localStorage.getItem('totalWater')) || 0;
    totalWater = storedWater;
}

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

function displayWeatherInfo(temp, city) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `It's ${temp}°C in ${city}. ${temp > 30 ? 'Your goal has been adjusted for optimal hydration.' : 'Stay hydrated!'}`;
}

function updateUI() {
    const percent = Math.min(Math.floor((totalWater / goal) * 100), 100);
    const remaining = Math.max(goal - totalWater, 0);

    document.getElementById('percent-num').innerText = percent;
    document.getElementById('current-ml').innerText = totalWater;
    document.getElementById('goal-display').innerText = goal;
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
    const colors = isHeatMode
        ? ['#ff8246', '#ffffff', '#ffb088']
        : ['#00d4ff', '#ffffff', '#00ff88'];

    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });
}
