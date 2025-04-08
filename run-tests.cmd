@echo off
setlocal

:: Set your emulator name (use "emulator -list-avds" to find it)
set EMULATOR_NAME=Pixel_7

echo 🔄 Restarting ADB server...
adb kill-server
adb start-server
timeout /t 2 >nul

:: Function to check if any device is connected
for /f "tokens=1,2" %%a in ('adb devices ^| findstr /R /C:"device$"') do (
    set DEVICE_RUNNING=true
)

if defined DEVICE_RUNNING (
    echo ✅ Android device or emulator already running!
) else (
    echo 🚀 Starting Android emulator: %EMULATOR_NAME%
    start "" emulator -avd %EMULATOR_NAME% -no-snapshot-load -no-audio -no-window -delay-adb

    echo ⏳ Waiting for emulator to appear in ADB...
    for /L %%i in (1,1,30) do (
        adb devices | findstr /R /C:"emulator" >nul
        if not errorlevel 1 (
            echo ✅ Emulator detected by ADB!
            goto WaitForBoot
        )
        echo ⏳ Still waiting for ADB to detect emulator... (%%i)
        timeout /t 5 >nul
    )

    :WaitForBoot
    echo ⏳ Waiting for emulator to fully boot...
    for /L %%i in (1,1,30) do (
        for /f %%b in ('adb shell getprop sys.boot_completed') do (
            if "%%b"=="1" (
                echo ✅ Emulator fully booted!
                goto AfterBoot
            )
        )
        echo ⏳ Emulator booting... (%%i)
        timeout /t 5 >nul
    )
)

:AfterBoot

:: Start Appium
echo 🚀 Starting Appium server...
start "" cmd /c "npx appium"
timeout /t 5 >nul

:: Clean up old Allure results and reports
echo 🧹 Cleaning previous Allure results and reports...

if exist allure-results (
    echo 🗑️ Deleting existing ./allure-results folder...
    rmdir /s /q allure-results
)

if exist allure-report (
    echo 🗑️ Deleting existing ./allure-report folder...
    rmdir /s /q allure-report
)

:: Run WebdriverIO tests
echo 🚀 Running WebdriverIO tests...
npx wdio run ./wdio.conf.ts

:: Kill Appium server
echo 🛑 Stopping Appium server...
for /f "tokens=2 delims=," %%i in ('tasklist /v ^| findstr /i "node.exe" ^| findstr "appium"') do (
    taskkill /PID %%i /F
)

:: Kill emulator
echo 🛑 Stopping emulator...
adb -s emulator-5554 emu kill

:: Generate Allure Report
echo 🚀 Generating Allure Report...
if exist allure-results (
    dir /b allure-results | findstr . >nul
    if not errorlevel 1 (
        allure generate allure-results --clean -o allure-report
        echo ✅ Allure Report generated successfully!
    ) else (
        echo ❌ Allure results not found, cannot generate report.
        exit /b 1
    )
)

:: Open Allure Report
echo 🚀 Opening Allure Report...
allure open allure-report

echo ✅ Test execution completed!
endlocal
