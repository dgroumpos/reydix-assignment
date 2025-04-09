
# 📱 PokEvent Mobile Automation Testing

This project contains an automated test suite for the **PokEvent Android app**, built using **WebdriverIO**, **Appium**, **Cucumber**, and **TypeScript**.

---

## ✅ Prerequisites

Before running the tests, ensure the following are installed and set up on your machine:

### 🧰 General Requirements
- **Node.js** (v16+ recommended)
- **Java SDK** (for Appium & Android emulator)
- **Android SDK** and a working **emulator**
- **Appium** (installed globally via `npm`)
- **Allure CLI** (installed globally)

### 📦 Global Install Commands

```bash
npm install -g appium
npm install -g allure-commandline --save-dev
📁 APK Placement

Place the PokEvent APK manually into the following folder:

/apk/app-debug.apk
This location is already referenced in the WebdriverIO configuration (wdio.conf.ts), so no path changes are required.
📱 Emulator Setup

A working Android emulator must already exist (create one using Android Studio or avdmanager).
Its name should match the deviceName in your wdio.conf.ts file:
'appium:deviceName': 'emulator-5554'
Ensure the emulator is booted and ready before running the tests.
🛠 Project Setup

Clone the repository:
git clone <your-git-repo-url>
cd <repo-name>
Install project dependencies:
npm install
▶️ Running the Tests

✅ Make sure the Android emulator is running and fully booted before executing the scripts.
🪟 For Windows Users:
run-tests.cmd
🍎 For macOS/Linux Users:
./start-test.sh
📊 Allure Report

The test suite automatically generates an Allure report after execution.
The report will open in your default browser once tests complete.
To view it manually later:

allure open ./allure-report
📁 Project Structure

.
├── apk/                         # PokEvent APK goes here
├── features/                   # Feature files, step definitions, world, and page objects
│   ├── interfaces/
│   ├── pageobjects/
│   ├── step-definitions/
│   └── support/
├── allure-results/             # Allure test results (auto-generated)
├── allure-report/              # Allure HTML report (auto-generated)
├── wdio.conf.ts                # WebdriverIO + Appium configuration
├── run-tests.cmd               # Windows runner
├── start-test.sh               # macOS/Linux runner
├── README.md

📝 Observations

Regarding the connect / disconnect functionality, I faced several issues when trying to implement the swiping to the last element and connecting at the same time scenario. Therefore I did the best workaround I possibly could, however you will observe that not all cards are clicked on the correct order and some not at all. In my opinion, the elements structure does not favor the swiping functionality, as each card should be ideally be a seperate view with all its details nested inside. That would have given me a better way to get the size of each card and swipe based on that. In my implementation I had to use the images of each card to do that and this probably lead to the inaccuracies.