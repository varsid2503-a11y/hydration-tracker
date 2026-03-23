# 💧 Hydration Tracker Pro

A high-performance, interactive web application designed to help users reach their daily water goals with style and safety. This project features real-time progress tracking, gamified achievements, and a celebration system.

## 🌟 New "Victory" Features

- **Confetti Celebration**: Reaching your goal triggers a high-quality "flower shower" animation using the canvas-confetti library.
- **Victory Trophy**: A custom modal with a "pop-in" animation appears when you become a "Hydration Hero."
- **Advanced Safety**: Hard-coded logic prevents users from logging more than 4000ml, ensuring healthy habits.
- **Interactive UI**: Includes "How to Use" and "Achievement Guide" popups for a smooth user experience.

## 🛠️ Tech Stack

- **HTML5**: Semantic structure with custom Meta tags for Google SEO.
- **CSS3**: Advanced Flexbox layouts, Keyframe animations, and Z-index management.
- **JavaScript (ES6)**:
  - *Async API*: Fetches daily water facts.
  - **LocalStorage**: Saves your badges and progress even after a refresh.
  - **Library Integration**: Uses canvas-confetti for professional-grade animations.

## 🎖️ Achievement System

- 🌱 **First Sip**: Log your first drink.
- 🏆 **Hero**: Hit your 100% daily goal.
- 🌊 **Max**: Reach the absolute 4000ml safety limit.

## 🐛 Bug Fixes
* **Persistence Issue (March 2026):** Fixed a bug where the custom Daily Goal would reset to 2000ml after a page refresh. Added `localStorage` support for the `goal-input` field so user settings are preserved.

## See the Result
If you wannt to run the web app, copy the below link paste it it in your *The Address Bar*(search bar -> located at the top of chrom browser):
https://varsid2503-a11y.github.io/hydration-tracker/