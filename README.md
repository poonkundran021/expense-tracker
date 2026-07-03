# 💰 Expense Tracker

A full-featured mobile expense tracking app built with React Native (Expo) and TypeScript. Track spending, set category budgets, and manage your finances — all stored locally on your device.

## Features

- **Dashboard** — Live total spent, category-wise breakdown, and recent transactions at a glance
- **Add Transaction** — Validated form to log expenses with amount, category, and notes
- **Transaction History** — Full list of all transactions with long-press to delete
- **Budget Tracking** — Set monthly limits per category with visual progress bars (turns red when over budget)
- **Settings** — Dark mode toggle, currency selection, and a clear-all-data option
- **Responsive UI** — Layouts adapt to screen rotation (portrait/landscape)
- **Accessibility** — Respects system font scaling settings

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native) + TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Local Storage**:
  - `expo-sqlite` — transactions and budgets (relational data)
  - `@react-native-async-storage/async-storage` — user preferences (theme, currency)
- **State Management**: React Context (theme) + local component state

## Project Structure
