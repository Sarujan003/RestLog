# 🌙 RestLog – Sleep & Health Tracker

A cross-platform mobile application built with **React Native**, **Expo**, and **TypeScript** designed to help users track, manage, and understand their sleep habits.

This project was built as part of the technical evaluation for **NextGen Innovations**.

---

## 📹 Video Walkthrough
- **Walkthrough Link:** [Watch the 1-Minute Demo on Loom / Video](https://drive.google.com/file/d/1BXP8U9jn4eLWfFqeKRF9XOf8_HGK81_o/view?usp=sharing)
> *The video demonstrates logging a new entry, data persistence across app restarts via AsyncStorage, configuring the sleep score, viewing trends/insights, and deleting an entry from history.*

---

## ✨ Features

### 1. Log Sleep
- **Interactive Time Selection:** Modal pickers for Bedtime and Wake-up time.
- **Automatic Duration Calculation:** Real-time calculation of total sleep hours (handles overnight rollover across midnight seamlessly).
- **Automatic Sleep Score:** A 1–5 star score is calculated from sleep duration and the thresholds configured in Settings.
- **Notes:** Optional text input to record pre-sleep routines or observations.

### 2. Sleep History
- **Chronological List:** Clean card-based display of past sleep sessions showing date, sleep span, duration, rating, and notes.
- **Entry Management:** One-tap delete with confirmation alerts to prevent accidental data loss.
- **Empty State:** User-friendly placeholder when no records exist.

### 3. Trends & Insights
- **Weekly Duration Chart:** Visual bar chart displaying sleep hours across recent sessions powered by `react-native-chart-kit`.
- **Key Performance Indicators (KPIs):**
  - Average Sleep Score (out of 5.0)
  - Average Sleep Duration (in hours)

### 4. Settings
- Set the minimum sleep duration for 1 star.
- Set the number of extra hours required for each additional star.
- Preview the duration threshold for every score from 1 to 5 stars.
- Save settings offline or reset to the defaults (4 hours for 1 star, plus 1.5 hours per additional star).
- Updated thresholds apply to new logs; existing history scores remain unchanged.

### 5. Offline Persistence
- Powered by `@react-native-async-storage/async-storage`.
- Sleep entries and rating settings are saved locally and persist across app closures and restarts.
- Centralized state management using React Context API for instant updates across all screens.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native / Expo (SDK 57)** | Cross-platform mobile framework |
| **TypeScript** | Static typing and compile-time safety |
| **React Navigation (v6/v7)** | Bottom tab navigation |
| **AsyncStorage** | Local, offline-first persistent storage |
| **React Native Chart Kit & SVG** | Visual data analytics and charts |
| **Custom TimePickerModal** | Pure JS cross-platform modal time picker |

---

## 📁 Project Architecture

```text
RestLog/
├── src/
│   ├── components/
│   │   └── TimePickerModal.tsx   # Custom cross-platform time selection modal
│   ├── context/
│   │   └── SleepContext.tsx      # Global state + AsyncStorage persistence for entries and settings
│   ├── screens/
│   │   ├── LogSleepScreen.tsx    # Screen 1: Bedtime, wake time, rating, note
│   │   ├── HistoryScreen.tsx     # Screen 2: List past logs + delete action
│   │   └── TrendsScreen.tsx      # Screen 3: Bar chart + KPI averages
│   │   ├── SettingsScreen.tsx    # Configure duration-based sleep score thresholds
│   ├── types/
│   │   └── index.ts              # SleepEntry TypeScript interfaces
│   └── utils/
│       └── dateHelpers.ts        # Duration math, score calculation, formatting helpers
├── App.tsx                       # Navigation setup & Context Provider
├── app.json                      # Expo app configuration
├── package.json
└── tsconfig.json

🚀 Getting Started

Prerequisites

  - Node.js (v18 or higher recommended)
  - Expo Go installed on your iOS or Android device

Installation

1.  Clone the repository:

    git clone https://github.com/<YOUR_GITHUB_USERNAME>/RestLog.git
    cd RestLog

2.  Install dependencies:

    npm install --legacy-peer-deps

3.  Start the development server:

    npx expo start -c
