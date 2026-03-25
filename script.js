const app = document.getElementById("app");
const storageKey = "varsid_hydratepro_state_v2";
const legacyWeightKey = "varsid_weight";
const legacyIntakeKey = "varsid_intake";
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
});
const shortFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short"
});

let chartInstance = null;
let historyOpen = false;

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getTodayKey() {
    return formatDateKey(new Date());
}

function formatNumber(value) {
    return new Intl.NumberFormat().format(Math.round(value));
}

function clampWeight(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return 60;
    }

    return Math.min(Math.max(parsed, 20), 250);
}

function buildLastSevenDays() {
    const days = [];

    for (let index = 6; index >= 0; index -= 1) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - index);
        days.push({
            date: formatDateKey(date),
            amount: 0
        });
    }

    return days;
}

function migrateLegacyState() {
    const legacyWeight = clampWeight(localStorage.getItem(legacyWeightKey) || 60);
    const legacyIntake = JSON.parse(localStorage.getItem(legacyIntakeKey) || "[]");
    const fallbackHistory = buildLastSevenDays();

    if (Array.isArray(legacyIntake) && legacyIntake.length === 7) {
        fallbackHistory.forEach((entry) => {
            const weekdayIndex = new Date(entry.date).getDay();
            const amount = Number(legacyIntake[weekdayIndex]);
            entry.amount = Number.isFinite(amount) && amount > 0 ? amount : 0;
        });
    }

    return {
        weight: legacyWeight,
        history: fallbackHistory
    };
}

function normalizeHistory(history) {
    const lastSevenDays = buildLastSevenDays();
    const historyMap = new Map(
        (Array.isArray(history) ? history : []).map((entry) => [entry.date, Number(entry.amount) || 0])
    );

    return lastSevenDays.map((entry) => ({
        date: entry.date,
        amount: Math.max(0, historyMap.get(entry.date) || 0)
    }));
}

function loadState() {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
        return migrateLegacyState();
    }

    try {
        const parsed = JSON.parse(saved);
        return {
            weight: clampWeight(parsed.weight),
            history: normalizeHistory(parsed.history)
        };
    } catch (error) {
        return migrateLegacyState();
    }
}

let state = loadState();

function saveState() {
    state.history = normalizeHistory(state.history);
    localStorage.setItem(storageKey, JSON.stringify(state));
}

function getTodayEntry() {
    const todayKey = getTodayKey();
    let todayEntry = state.history.find((entry) => entry.date === todayKey);

    if (!todayEntry) {
        state.history = normalizeHistory(state.history);
        todayEntry = state.history.find((entry) => entry.date === todayKey);
        saveState();
    }

    return todayEntry;
}

function getDailyGoal() {
    return Math.round(state.weight * 35);
}

function getCompletionPercent() {
    const goal = getDailyGoal();
    const current = getTodayEntry().amount;

    if (!goal) {
        return 0;
    }

    return Math.min(Math.round((current / goal) * 100), 100);
}

function getRemainingAmount() {
    return Math.max(getDailyGoal() - getTodayEntry().amount, 0);
}

function getAverageIntake() {
    const total = state.history.reduce((sum, entry) => sum + entry.amount, 0);
    return Math.round(total / state.history.length);
}

function buildHistoryMarkup() {
    return [...state.history]
        .reverse()
        .map((entry) => {
            const date = new Date(`${entry.date}T00:00:00`);
            const isToday = entry.date === getTodayKey();
            const dayLabel = dateFormatter.format(date);
            const subLabel = isToday ? "Today" : shortFormatter.format(date);

            return `
                <div class="history-item">
                    <div>
                        <strong>${dayLabel}</strong>
                        <small>${subLabel}</small>
                    </div>
                    <strong>${formatNumber(entry.amount)} ml</strong>
                </div>
            `;
        })
        .join("");
}

function buildAppMarkup() {
    const todayEntry = getTodayEntry();
    const goal = getDailyGoal();
    const percent = getCompletionPercent();
    const remaining = getRemainingAmount();
    const message = percent >= 100
        ? "Goal reached. Nice work staying hydrated."
        : `${formatNumber(remaining)} ml left to reach your goal today.`;

    return `
        <section class="dashboard" aria-label="HydratePro dashboard">
            <div class="hero">
                <div>
                    <span class="eyebrow">Hydration Dashboard</span>
                    <h1>HydratePro</h1>
                    <p>${dateFormatter.format(new Date())}</p>
                </div>
                <div class="goal-pill">
                    <span>Daily Goal</span>
                    <strong>${formatNumber(goal)} ml</strong>
                </div>
            </div>

            <section class="progress-card" aria-label="Daily hydration progress">
                <div class="progress-meta">
                    <div>
                        <p>Today's intake</p>
                        <strong>${percent}%</strong>
                    </div>
                    <div class="progress-copy">
                        <p>${formatNumber(todayEntry.amount)} ml logged</p>
                        <p class="status-line">${message}</p>
                    </div>
                </div>
                <div class="progress-track" aria-hidden="true">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span>Current</span>
                        <strong>${formatNumber(todayEntry.amount)} ml</strong>
                    </div>
                    <div class="stat-card">
                        <span>Remaining</span>
                        <strong>${formatNumber(remaining)} ml</strong>
                    </div>
                    <div class="stat-card">
                        <span>7-Day Avg</span>
                        <strong>${formatNumber(getAverageIntake())} ml</strong>
                    </div>
                </div>
            </section>

            <section class="panel" aria-label="Log water intake">
                <div class="panel-header">
                    <div>
                        <h2>Log a drink</h2>
                        <p>Add the amount you just drank in milliliters.</p>
                    </div>
                </div>
                <form id="intakeForm" novalidate>
                    <label class="sr-only" for="waterInput">Water intake in milliliters</label>
                    <div class="form-row">
                        <input id="waterInput" name="water" type="number" inputmode="numeric" min="1" step="10" placeholder="Add water (ml)" required>
                        <button class="button-primary" type="submit">Add Drink</button>
                    </div>
                </form>
                <p class="message">Hydration goal uses the README formula: weight x 35 ml.</p>
            </section>

            <section class="panel" aria-label="Weekly analytics">
                <div class="panel-header">
                    <div>
                        <h2>Weekly analytics</h2>
                        <p>Track the last 7 days of water intake.</p>
                    </div>
                    <button id="historyToggle" class="button-secondary ${historyOpen ? "is-open" : ""}" type="button" aria-expanded="${historyOpen}">
                        ${historyOpen ? "Hide History" : "View History"}
                    </button>
                </div>
                <div class="chart-wrap">
                    <canvas id="chart" aria-label="Bar chart of hydration history"></canvas>
                </div>
                <div id="historyLog" class="history-list" ${historyOpen ? "" : "hidden"}>
                    ${buildHistoryMarkup()}
                </div>
            </section>

            <section class="panel" aria-label="Profile settings">
                <div class="panel-header">
                    <div>
                        <h2>Profile</h2>
                        <p>Update your weight to recalculate your hydration target.</p>
                    </div>
                </div>
                <form id="profileForm" novalidate>
                    <label class="sr-only" for="weightInput">Body weight in kilograms</label>
                    <div class="profile-row">
                        <input id="weightInput" name="weight" type="number" inputmode="decimal" min="20" max="250" step="0.1" value="${state.weight}">
                        <button class="button-secondary" type="submit">Update Profile</button>
                    </div>
                </form>
            </section>
        </section>
    `;
}

function attachEventListeners() {
    const intakeForm = document.getElementById("intakeForm");
    const profileForm = document.getElementById("profileForm");
    const historyToggle = document.getElementById("historyToggle");

    intakeForm.addEventListener("submit", handleAddWater);
    profileForm.addEventListener("submit", handleUpdateWeight);
    historyToggle.addEventListener("click", toggleHistory);
}

function renderChart() {
    const ctx = document.getElementById("chart");

    if (!ctx) {
        return;
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = state.history.map((entry) => shortFormatter.format(new Date(`${entry.date}T00:00:00`)));
    const todayKey = getTodayKey();

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Water intake (ml)",
                data: state.history.map((entry) => entry.amount),
                backgroundColor: state.history.map((entry) =>
                    entry.date === todayKey ? "#4cc9f0" : "rgba(202, 240, 248, 0.28)"
                ),
                hoverBackgroundColor: state.history.map((entry) =>
                    entry.date === todayKey ? "#7ddfff" : "rgba(202, 240, 248, 0.38)"
                ),
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            maintainAspectRatio: false,
            animation: {
                duration: 500
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label(context) {
                            return `${formatNumber(context.parsed.y)} ml`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#d4f4ff"
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#8eb8cb",
                        callback(value) {
                            return `${value} ml`;
                        }
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.08)"
                    }
                }
            }
        }
    });
}

function renderApp() {
    saveState();
    app.innerHTML = buildAppMarkup();
    attachEventListeners();
    renderChart();
}

function celebrateGoalReached(previousAmount, currentAmount) {
    const goal = getDailyGoal();

    if (previousAmount < goal && currentAmount >= goal && typeof confetti === "function") {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function handleAddWater(event) {
    event.preventDefault();

    const waterInput = document.getElementById("waterInput");
    const amount = Number.parseInt(waterInput.value, 10);

    if (!Number.isFinite(amount) || amount <= 0) {
        waterInput.focus();
        return;
    }

    const todayEntry = getTodayEntry();
    const previousAmount = todayEntry.amount;
    todayEntry.amount += amount;
    celebrateGoalReached(previousAmount, todayEntry.amount);
    renderApp();
}

function handleUpdateWeight(event) {
    event.preventDefault();

    const weightInput = document.getElementById("weightInput");
    const nextWeight = Number.parseFloat(weightInput.value);

    if (!Number.isFinite(nextWeight) || nextWeight < 20 || nextWeight > 250) {
        weightInput.focus();
        return;
    }

    state.weight = clampWeight(nextWeight);
    renderApp();
}

function toggleHistory() {
    historyOpen = !historyOpen;
    renderApp();
}

renderApp();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("sw.js")
            .then(() => console.log("SW Registered"))
            .catch((error) => console.log("SW Error", error));
    });
}
