# 💧 Hydration Tracker Pro

A high-performance, interactive web application designed to help users reach their daily water goals with style and safety. This project features real-time progress tracking, gamified achievements, and a celebration system.

🌟 New "Pro" Features (Add these)
PWA - Native App Experience: Install the tracker as a standalone app on Android, iOS, Windows, and Lenovo devices. It works without a browser address bar!

Daily Streak System: A "persistence engine" that tracks how many days in a row you hit your goal. Missing a day resets the 🔥 icon.

Deep-Sea Dark Mode: A custom-themed toggle that saves your preference (Light or Dark) even after the app is closed.

Interactive Refresh Fact: A high-touch button that fetches random water trivia via an external API with a built-in loading spinner.

Liquid Shimmer Animation: The progress bar now features a CSS-animated "wave" that makes the water level look like it's sloshing.

🛠️ Tech Stack (Update this)
PWA Architecture:

manifest.json: For cross-platform installation and home screen icons.

Service Workers (sw.js): Enables basic offline caching for a faster, app-like feel.

JavaScript (ES6+):

Notification API: Sends browser-level reminders every 30 minutes.

Logic Gates: Advanced date-comparison logic to calculate daily streaks.

## 🎖️ Achievement System

- 🌱 **First Sip**: Log your first drink.
- 🏆 **Hero**: Hit your 100% daily goal.
- 🌊 **Max**: Reach the absolute 4000ml safety limit.

## 🐛 Bug Fixes
* **Persistence Issue (March 2026):** Fixed a bug where the custom Daily Goal would reset to 2000ml after a page refresh. Added `localStorage` support for the `goal-input` field so user settings are preserved.

## See the Result
If you wannt to run the web app, copy the below link paste it it in your *The Address Bar*(search bar -> located at the top of chrom browser):
https://varsid2503-a11y.github.io/hydration-tracker/

*Once you open the link, click the "Install" icon in your address bar (on Desktop) or select "Add to Home Screen" (on Mobile) to use it as a real app!*