const waterInput = document.getElementById('water-input');
const addBtn = document.getElementById('add-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status');
const progressBar = document.getElementById('progress-bar');
const goalInput = document.getElementById('goal-input');
const historyList = document.getElementById('history-list');
const container = document.querySelector('.tracker-container');
const victoryMsg = document.getElementById('victory-msg');

let totalWater = localStorage.getItem('totalWater') ? parseInt(localStorage.getItem('totalWater')) : 0;
let history = JSON.parse(localStorage.getItem('waterHistory')) || [];
let target = parseInt(localStorage.getItem('waterGoal')) || 2000;
let lastDrinkTime = Date.now();

goalInput.value = target;

function updateUI() {
    target = parseInt(goalInput.value) || 0;
    statusText.innerText = `Total: ${totalWater}ml / ${target}ml`;
    
    const percentage = target > 0 ? Math.min((totalWater / target) * 100, 100) : 0;
    progressBar.style.width = `${percentage}%`;
    
    if (totalWater >= target && target > 0) {
        victoryMsg.style.display = "block";
        progressBar.style.background = "linear-gradient(90deg, #4caf50, #8bc34a)";
    } else {
        victoryMsg.style.display = "none";
        progressBar.style.background = "linear-gradient(90deg, #4fc3f7, #2196f3)";
    }
    
    historyList.innerHTML = history.slice().reverse().map(item => `<li>Added ${item}ml</li>`).join('');
    
    localStorage.setItem('totalWater', totalWater);
    localStorage.setItem('waterHistory', JSON.stringify(history));
    localStorage.setItem('waterGoal', target);
}

addBtn.addEventListener('click', () => {
    const amount = parseInt(waterInput.value);
    if (!isNaN(amount) && amount > 0) {
        totalWater += amount;
        history.push(amount);
        waterInput.value = '';
        lastDrinkTime = Date.now();
        container.style.backgroundColor = "white";
        updateUI();
    } else {
        alert("Please enter a valid amount.");
    }
});

resetBtn.addEventListener('click', () => {
    if(confirm("Reset all progress?")) {
        totalWater = 0;
        history = [];
        lastDrinkTime = Date.now();
        container.style.backgroundColor = "white";
        updateUI();
    }
});

goalInput.addEventListener('input', updateUI);

setInterval(() => {
    const currentTime = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;

    if (currentTime - lastDrinkTime > TEN_MINUTES && totalWater < target) {
        container.style.backgroundColor = "#ffeb3b";
        statusText.innerText = "Time to drink water! 💧";
    }
}, 1000);

updateUI();