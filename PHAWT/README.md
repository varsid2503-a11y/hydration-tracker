# 💧 Hydration Tracker & Wellness App

A lightweight, browser-based application designed to help users reach their daily water intake goals through real-time tracking, persistence, and automated reminders.

## 🚀 Features

- **Custom Goal Setting**: Users can define their daily milliliter (ml) target.
- **Persistent Data**: Uses localStorage to keep track of total intake and history even after refreshing the page.
- **Smart Reminders**: Automatically alerts the user via a visual UI change if no water is logged for 10 minutes.
- **Victory State**: Dynamic progress bar changes color and displays a trophy when the goal is achieved.
- **Activity Log**: A chronological history of all water added during the session.

## 🛠️ Tech Stack

- **HTML5**: Semantic structure for the tracker interface.
- **CSS3**: Responsive design with Flexbox and keyframe animations for the "Victory" state.
- **JavaScript (Vanilla)**: Core logic for state management, DOM manipulation, and asynchronous timing functions.

## 📂 Project Structure

```
├── index.html   # Application skeleton and UI components
├── style.css    # Layout, colors, and animations
├── script.js    # Logic, persistence, and reminder intervals
└── README.md    # Project documentation
```

## ⚙️ How It Works

1. **Input**: The user enters a numerical value (ml) and clicks "Add Water."
2. **Processing**: The JavaScript updates the `totalWater` variable, saves it to the browser's local storage, and pushes the entry to the `history` array.
3. **UI Feedback**: The progress bar width is calculated as `(total / target) * 100%`.
4. **Monitoring**: A `setInterval` function checks the `lastDrinkTime` every second. If the difference exceeds 600,000ms (10 mins), the background color shifts to yellow.