# 🌸 MamaRise - Setup & Running Guide (Windows / Mac / Linux)

This is a complete, production-ready React application for **MamaRise**. Follow the simple steps below to run it on your Windows laptop.

---

## 📋 Prerequisites (One-Time Setup on Windows)

1. **Install Node.js (Version 18 or 20 LTS recommended):**
   - Download the Windows Installer (.msi) from the official website: [https://nodejs.org/](https://nodejs.org/)
   - Run the installer and click **Next** through all default options.
   - Once installed, open **Command Prompt (cmd)** or **PowerShell** and verify:
     ```bash
     node -v
     npm -v
     ```

---

## 🚀 How to Run the Project (Easy 3 Steps)

### Method 1: Double-Click Helper (Easiest for Windows)
1. Extract this zip file into a folder on your Windows laptop (e.g. `C:\Projects\mamarise-project` or on Desktop).
2. Double-click the file named **`start-windows.bat`**.
3. It will automatically install dependencies and launch the app in your browser at `http://localhost:3000`!

---

### Method 2: Using Command Prompt / PowerShell / VS Code Terminal

1. **Open Command Prompt / PowerShell** and navigate to the extracted folder:
   ```bash
   cd path\to\mamarise-project
   ```
   *(For example: `cd C:\Users\YourName\Desktop\mamarise-project`)*

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```

4. **Open in Browser:**
   - The browser should open automatically, or open **Google Chrome / Microsoft Edge** and visit:
   - **`http://localhost:3000`**

---

## 🧪 How to Run Automated Tests

To verify that all test suites pass:
```bash
npm test -- --watchAll=false
```

---

## 🔑 Demo Logins & Roles

- **Mom Portal:**
  - Email: `aisha@mamarise.app`
  - Password: `recover123`
- **Partner Portal:**
  - Email: `rohan@mamarise.app`
  - Password: `support123`
- Or use the **Quick Demo Role Buttons** on the Login screen to switch between **Mom** and **Partner** accounts instantly!

---

## 🛠️ Key Features Included
- **Mom Dashboard:** Daily triage check-in, load balance mirror, recovery pulse, Nourish Nudge, Care Circle.
- **Partner Dashboard:** Live partner sync, "I'll handle this", task takeover, shared household load, notifications.
- **Career Restart Hub:** Video course tracks in **UI/UX Design**, **Python**, **Java**, **Self-Financing & Freelancing**, and **Data Analytics** with active study watch-time tracking and Page Visibility pause/resume.
- **Voice Assistant:** Real speech-to-text with entity extraction for hands-free task logging.
- **Readiness Portfolio:** Exportable and printable verified career transition credential.
