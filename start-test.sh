#!/bin/bash

# Set emulator name (Replace with your emulator name from `emulator -list-avds`)
EMULATOR_NAME="Pixel_7"

# Function to check if an emulator or device is running
function is_device_running {
    adb devices | grep -w "device" >/dev/null 2>&1
}

# Restart ADB to ensure it's running
echo "🔄 Restarting ADB server..."
adb kill-server
adb start-server
sleep 2  # Give it a moment to restart

# Start emulator if no device is running
if is_device_running; then
    echo "✅ Android device or emulator already running!"
else
    echo "🚀 Starting Android emulator: $EMULATOR_NAME"
    nohup emulator -avd "$EMULATOR_NAME" -no-snapshot-load -no-audio -no-window -delay-adb > /dev/null 2>&1 &

    echo "⏳ Waiting for emulator to appear in ADB..."
    for i in {1..30}; do  # Wait up to 150 seconds (30 * 5s)
        if adb devices | grep -w "emulator"; then
            echo "✅ Emulator detected by ADB!"
            break
        fi
        echo "⏳ Still waiting for ADB to detect emulator... ($i)"
        sleep 5
    done

    echo "⏳ Waiting for emulator to fully boot..."
    for i in {1..30}; do  # Wait up to 150 seconds (30 * 5s)
        if adb shell getprop sys.boot_completed 2>/dev/null | grep -q "1"; then
            echo "✅ Emulator fully booted!"
            break
        fi
        echo "⏳ Emulator booting... ($i)"
        sleep 5
    done
fi

# Start Appium server
echo "🚀 Starting Appium server..."
npx appium &

# Wait for Appium to start
sleep 5

# Clean up old Allure results and reports
echo "🧹 Cleaning previous Allure results and reports..."

if [ -d "./allure-results" ]; then
    echo "🗑️ Deleting existing ./allure-results folder..."
    rm -rf ./allure-results
fi

if [ -d "./allure-report" ]; then
    echo "🗑️ Deleting existing ./allure-report folder..."
    rm -rf ./allure-report
fi

# Run WebdriverIO tests
echo "🚀 Running WebdriverIO tests..."
npx wdio run ./wdio.conf.ts

# Stop Appium server after tests
echo "🛑 Stopping Appium server..."
pkill -f "appium"

# (Optional) Kill emulator after tests
if ! is_device_running; then
    echo "🛑 Stopping emulator..."
    adb emu kill
fi

# Generate Allure Report after tests are complete
echo "🚀 Generating Allure Report..."

# Ensure the allure-results folder exists and has content
if [ -d "./allure-results" ] && [ "$(ls -A ./allure-results)" ]; then
    allure generate ./allure-results --clean -o ./allure-report
    echo "✅ Allure Report generated successfully!"
else
    echo "❌ Allure results not found, cannot generate report."
    exit 1
fi

# Open Allure Report
echo "🚀 Opening Allure Report..."
allure open ./allure-report

echo "✅ Test execution completed!"
