let currentTotal = 0;
let dailyGoal = 2000;
let intakeLog = [];
let snoozeMinutes = 10;
let isFocusMode = false;
let focusTimer = null;
const glassSize = 250;

window.onload = () => {
  const savedTotal = localStorage.getItem('currentTotal');
  const savedLog = localStorage.getItem('intakeLog');
  const savedSnooze = localStorage.getItem('snoozeTime');
  
  if (savedTotal) currentTotal = parseInt(savedTotal);
  if (savedLog) intakeLog = JSON.parse(savedLog);
  if (savedSnooze) snoozeMinutes = parseInt(savedSnooze);
  
  updateUI();
  startReminders();
};

function addWater(amount) {
  currentTotal += amount;
  intakeLog.push({ 
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
    amount: amount 
  });
  
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
  
  saveData();
  updateUI();
  checkGoal();
}

function checkGoal() {
  if (currentTotal >= dailyGoal) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b4d8', '#caf0f8', '#90e0ef']
      });
    }
    showVictoryModal();
  }
}

function updateUI() {
  const percentage = Math.min(Math.floor((currentTotal / dailyGoal) * 100), 100);
  
  const percentText = document.getElementById('percentage-text');
  if (percentText) percentText.innerText = percentage + "%";
  
  const circle = document.querySelector('.progress-circle');
  if (circle) {
    circle.style.background = `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#00b4d8 ${percentage}%, #caf0f8 0%)`;
  }
  
  const display = document.getElementById('total-display');
  if (display) display.innerText = currentTotal + "ml";

  const list = document.getElementById('history-list');
  if (list) {
    list.innerHTML = intakeLog.slice(-3).reverse().map(item => 
      `<li>Dropped ${item.amount}ml at ${item.time}</li>`
    ).join('');
  }
}

function toggleFocusMode() {
  const checkbox = document.getElementById('focus-toggle');
  isFocusMode = checkbox.checked;

  if (isFocusMode) {
    focusTimer = setTimeout(() => {
      isFocusMode = false;
      if (checkbox) checkbox.checked = false;
      new Notification("Focus Mode Over", { body: "Hydration reminders are back on!" });
    }, 45 * 60 * 1000);
  } else {
    clearTimeout(focusTimer);
  }
}

function showHydrationNotification() {
  if (Notification.permission === "granted" && currentTotal < dailyGoal && !isFocusMode) {
    const notification = new Notification("Time to Hydrate!", {
      body: `Goal: ${dailyGoal}ml. You are at ${currentTotal}ml.`,
      icon: "icon.png",
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      addWater(glassSize);
      notification.close();
    };
  }
}

function startReminders() {
  setInterval(showHydrationNotification, 900000);
}

function saveData() {
  localStorage.setItem('currentTotal', currentTotal);
  localStorage.setItem('intakeLog', JSON.stringify(intakeLog));
}

function resetApp() {
  if (confirm("Are you sure you want to reset today's progress?")) {
    currentTotal = 0;
    intakeLog = [];
    saveData();
    updateUI();
  }
}

function showVictoryModal() {
  const modal = document.getElementById('victory-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeVictory() {
  const modal = document.getElementById('victory-modal');
  if (modal) modal.classList.add('hidden');
}