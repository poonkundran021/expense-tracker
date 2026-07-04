## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version)
- [Expo Go](https://expo.dev/go) app installed on your phone (for development)

### Installation

```bash
git clone https://github.com/poonkundran021/expense-tracker.git
cd expense-tracker
npm install
npx expo start
```

Scan the QR code shown in the terminal using the **Expo Go** app on your phone.

## How It Works

- **Authentication**: Each user registers with a name and PIN. Login sessions persist via AsyncStorage, so users stay logged in until they explicitly log out.
- **Data isolation**: Every transaction and budget is tagged with a `user_id` in SQLite, so switching profiles on the same device shows completely separate data.
- **Local-first**: All transaction and budget data is stored locally using SQLite — no backend or internet connection required for core functionality.
- **Responsive**: The app supports both portrait and landscape orientations, with the Dashboard reflowing into a multi-column layout in landscape.
- **Accessible**: Text scales automatically with the device's system accessibility font size settings.

## Screens Overview

| Screen | Purpose |
|---|---|
| Login | PIN-based authentication for returning users |
| Register | Create a new local profile |
| Home | Overview of total spending, category breakdown, recent activity |
| Add Transaction | Form to log a new expense |
| History | Complete transaction list with delete capability |
| Budget | Set and track category-wise spending limits |
| Settings | Profile info, theme, currency, and account management |

## Building an APK

This project uses EAS Build to generate a standalone installable APK:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

See `eas.json` for build profile configuration.

## Future Improvements

- Currency conversion via live exchange rate API
- Category selection via dropdown instead of free text
- Charts for spending trends over time
- Push notifications for budget threshold alerts
- Biometric login (fingerprint/Face ID) as an alternative to PIN

## Author

**Poonkundran** — 2nd Year Electronics Student
- LinkedIn: [poonkundran-r](https://www.linkedin.com/in/poonkundran-r-046551328)
- Email: poonkundran21@gmail.com
