# 🌿 CarbonSaathi

> **Mission LiFE Aligned Personal Carbon & Fitness Tracker**  
> *Smart India Hackathon (SIH) Solution for Urban Commute Sustainability & Gamified Wellness*

🔗 **Live Demo:** [https://sih-project-demo-repo.vercel.app/](https://sih-project-demo-repo.vercel.app/)

---

## 🚀 Overview

**CarbonSaathi** is a Progressive Web Application (PWA) designed to incentivize sustainable urban commuting across Indian cities. By combining automated transport mode detection with real-time gCO2 emission calculations and instant cashout rewards, CarbonSaathi transforms daily green commuting into real monetary rewards and community recognition.

---

## ✨ Key Features

### 🔐 1. Authentication & Security
- **Strict Email & Password Verification**: Live syntax check, password strength indicators, and local credentials database.
- **One-Tap SSO**: Support for Google SSO and Govt DigiLocker / Mission LiFE single sign-on simulation.
- **Login-First Flow**: Enforces user authentication before granting access to personal carbon tracking metrics.

### 🚗 2. Indian Commute gCO2 Emission Calculator
- **Modes Supported**: Walking / Running (0 gCO2), Bicycle (0 gCO2), City Metro (15 gCO2/km), Shared E-Rickshaw/Auto (28 gCO2/km), Electric 2W (12 gCO2/km), Petrol 4W Car (142 gCO2/km baseline).
- **Standards Aligned**: Calculation models aligned with NITI Aayog Mission LiFE guidelines & MoRTH vehicle emission factors.

### 🏆 3. Hyperlocal Circle Leaderboards & Team Battles
- **Circle Categories**: College Campus, Corporate Office, and Housing Society leaderboards.
- **Department Wars**: Inter-department sustainability competitions (e.g. CS vs ECE 500kg CO2 Slash drive).

### 💰 4. Instant Point Cashout & Rewards Portal
- **Direct Conversion**: `100 Green PTS = ₹10.00 INR`.
- **Multi-Destination Cashout**: Instant payouts to **UPI (GPay / Paytm)**, **DMRC Metro Smart Card**, or **Amazon Pay Gift Cards**.
- **Real-Time UTR Ledger**: Maintains transaction history with unique UTR tracking codes.

### 🛡️ 5. DPDP Act 2023 Pseudonym Privacy Mode
- On-device GPS processing ensures user location privacy. Toggleable **Pseudonym Mode** displays user alias on public leaderboards while keeping personal identities secure.

### 📱 6. Progressive Web App (PWA)
- **Installable**: Full offline Service Worker caching (`sw.js`) and Web App Manifest (`manifest.json`).
- **Network Awareness**: Live online/offline status detection badge.

### 📸 7. Weekly Impact Social Graphic Generator
- Dynamic card canvas generator using `html2canvas` for sharing weekly CO2 savings & calories burned on Instagram/LinkedIn.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript (ES6+)
- **Icons**: Lucide Icons & FontAwesome
- **Visualizations**: Chart.js (Bar & Doughnut Charts)
- **Effects**: Canvas Confetti & html2canvas
- **Offline / PWA**: Service Worker API, Cache API, Web Manifest
- **Local Server**: Python `http.server` (Zero-dependency deployment)

---

## 🏁 Quick Start & Local Installation

### Prerequisites
- Python 3.x installed on your machine.

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayusharma1601/SIH-project-demo-repo.git
   cd SIH-project-demo-repo
   ```

2. **Start the local HTTP server:**
   ```bash
   python -m http.server 8000
   ```

3. **Open in Browser:**
   Navigate to [http://localhost:8000](http://localhost:8000)

---

## 🔑 Demo Test Credentials

To test the application login immediately, use the default demo credentials:

- **Email:** `aysha@example.com`
- **Password:** `Password123`

*(Or click **Create Account** to register a new user in your browser's local storage!)*

---

## 📜 License

This project is developed for the **Smart India Hackathon (SIH)**. All rights reserved.
