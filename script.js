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
  intakeLog.push({ time: new Date().toLocaleTimeString(), amount: amount });
  
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
        origin: { y: 0.6 }
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
    circle.style.setProperty('--fill-height', percentage + '%');
    circle.style.background = `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#00b4d8 ${percentage}%, #caf0f8 0%)`;
  }
  
  const display = document.getElementById('total-display');
  if (display) display.innerText = currentTotal + "ml";

  const list = document.getElementById('history-list');
  if (list) {
    list.innerHTML = intakeLog.slice(-3).reverse().map(item => 
      `<li>Drank ${item.amount}ml at ${item.time}</li>`
    ).join('');
  }
}

function saveData() {
  localStorage.setItem('currentTotal', currentTotal);
  localStorage.setItem('intakeLog', JSON.stringify(intakeLog));
}

function showHydrationNotification() {
  if (Notification.permission === "granted" && currentTotal < dailyGoal && !isFocusMode) {
    const notification = new Notification("Time to Hydrate!", {
      body: "Drink " + glassSize + "ml or Snooze for " + snoozeMinutes + " mins.",
      requireInteraction: true,
      icon: "icon.png",
      actions: [
        { action: "snooze", title: "Snooze" }
      ]
    });

    notification.onclick = () => {
      window.focus();
      addWater(glassSize);
      notification.close();
    };

    notification.onaction = (e) => {
      if (e.action === "snooze") {
        snoozeNotification();
      }
      notification.close();
    };
  }
}

function snoozeNotification() {
  const ms = snoozeMinutes * 60 * 1000;
  setTimeout(() => {
    showHydrationNotification();
  }, ms);
}

function startReminders() {
  setInterval(() => {
    showHydrationNotification();
  }, 900000);
}

function toggleFocusMode() {
  const checkbox = document.getElementById('focus-toggle');
  isFocusMode = checkbox.checked;

  if (isFocusMode) {
    focusTimer = setTimeout(() => {
      isFocusMode = false;
      if (checkbox) checkbox.checked = false;
      new Notification("Focus Mode Over", { body: "Reminders are back on!" });
    }, 45 * 60 * 1000);
  } else {
    clearTimeout(focusTimer);
  }
}

function updateSnoozeTime(newMins) {
  snoozeMinutes = parseInt(newMins);
  localStorage.setItem('snoozeTime', snoozeMinutes);
}

function resetApp() {
  if (confirm("Reset all progress for today?")) {
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