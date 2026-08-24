/**
 * CarbonSaathi Application State & Logic
 * Mission LiFE Aligned Personal Carbon & Fitness Tracker (Auth First + Verification + PWA)
 */

// Default Initial User Config
const DEFAULT_USER_CONFIG = {
    email: "aysha@example.com",
    realName: "Aysha Khan",
    pseudonym: "EcoPioneer_42",
    isPrivacyOn: true,
    circleCategory: "college",
    circleName: "IIT Delhi Campus",
    goalSteps: 10000,
    goalCo2Kg: 5.0,
    streakDays: 12,
    greenPoints: 1280,
    co2SavedTodayKg: 3.85,
    stepsToday: 8420,
    caloriesToday: 412,
    activeMinsToday: 45,
    scoreGrade: 92
};

// Seed default demo accounts database if empty
const DEFAULT_ACCOUNTS = [
    { email: 'aysha@example.com', password: 'Password123', name: 'Aysha Khan', circle: 'IIT Delhi Campus' },
    { email: 'rahul@example.com', password: 'Password123', name: 'Rahul Sharma', circle: 'DU North Campus' }
];

// Global State (Enforce Login First on App Launch)
const appState = {
    isAuthenticated: false, // Always prompt login first before launching dashboard
    authMode: 'signin',
    accounts: loadAccountsFromLocalStorage(),
    user: loadUserFromLocalStorage(),
    selectedMode: "walking",
    tripDistance: 5.0,
    activeLeaderboardCat: "college",
    deferredPwaPrompt: null,
    
    emissionFactors: {
        walking: { gCO2: 0, calPerKm: 48, label: "Walking / Running", emoji: "🚶" },
        cycling: { gCO2: 0, calPerKm: 32, label: "Bicycle / E-Bike", emoji: "🚲" },
        metro: { gCO2: 15, calPerKm: 8, label: "Delhi / City Metro", emoji: "🚇" },
        shared_auto: { gCO2: 28, calPerKm: 12, label: "Shared Auto / E-Rickshaw", emoji: "🛺" },
        ev_scooter: { gCO2: 12, calPerKm: 5, label: "Electric 2W (EV)", emoji: "🛵" },
        petrol_car: { gCO2: 142, calPerKm: 0, label: "Petrol Car (Solo Driver)", emoji: "🚗" }
    },
    
    sensorStream: loadStreamFromLocalStorage(),
    cashoutHistory: loadCashoutHistoryFromLocalStorage(),

    leaderboards: {
        college: [
            { rank: 1, name: "Aarav_Green (IITB)", mode: "🚲 Bicycle + Metro", co2: 34.2, streak: 19, avatar: "🏆" },
            { rank: 2, name: "Priya_DU (DU North)", mode: "🚇 Delhi Metro", co2: 28.5, streak: 15, avatar: "🥈" },
            { rank: 3, name: "EcoRider_99 (Anna Univ)", mode: "🚶 Walking Only", co2: 24.1, streak: 14, avatar: "🥉" },
            { rank: 4, name: "USER_PLACEHOLDER", mode: "🚶 Walk + Metro", co2: 18.5, streak: 12, isUser: true, avatar: "👤" },
            { rank: 5, name: "PedalMaster (BITS Pilani)", mode: "🚲 E-Bike", co2: 16.8, streak: 9, avatar: "🚲" },
            { rank: 6, name: "GreenCommuter_7 (JNU)", mode: "🛺 E-Rickshaw", co2: 14.5, streak: 8, avatar: "🌿" }
        ],
        office: [
            { rank: 1, name: "TechEco_Lead (Infosys)", mode: "🚌 Office Electric Bus", co2: 42.0, streak: 24, avatar: "🏆" },
            { rank: 2, name: "GreenDev_9 (TCS Cyber)", mode: "🚇 Metro Commute", co2: 36.4, streak: 18, avatar: "🥈" },
            { rank: 3, name: "USER_PLACEHOLDER", mode: "🚶 Walk + E-Scooter", co2: 18.5, streak: 12, isUser: true, avatar: "👤" },
            { rank: 4, name: "Sustainability_Hero (Wipro)", mode: "🚲 Bicycle", co2: 17.2, streak: 10, avatar: "🌱" },
            { rank: 5, name: "CommuteZero (HCL Pune)", mode: "🛺 Shared Auto", co2: 15.0, streak: 7, avatar: "⚡" }
        ],
        society: [
            { rank: 1, name: "DLF_GreenRider (Gurgaon)", mode: "🛵 EV Scooter", co2: 29.8, streak: 16, avatar: "🏆" },
            { rank: 2, name: "USER_PLACEHOLDER", mode: "🚶 Walking + Metro", co2: 18.5, streak: 12, isUser: true, avatar: "👤" },
            { rank: 3, name: "Hiranandani_Walk (Mumbai)", mode: "🚶 Morning Walk", co2: 17.9, streak: 11, avatar: "🏃" },
            { rank: 4, name: "Prestige_Eco (Bengaluru)", mode: "🚲 E-Bike", co2: 12.4, streak: 6, avatar: "🚴" }
        ]
    },

    challenges: [
        {
            id: 'c1',
            title: "Inter-Department Battle: CS vs ECE 500kg CO2 Slash",
            deptA: "Computer Science",
            deptB: "Electronics & Comm",
            progressA: 380,
            progressB: 310,
            target: 500,
            daysLeft: 3,
            joined: true,
            userDept: "Computer Science",
            reward: "500 Green PTS + Free Cafeteria Coffee Pass"
        },
        {
            id: 'c2',
            title: "DMRC Metro Commuter Drive: North Campus vs South Campus",
            deptA: "DU North Campus",
            deptB: "DU South Campus",
            progressA: 820,
            progressB: 940,
            target: 1200,
            daysLeft: 5,
            joined: false,
            reward: "20% Metro Pass Voucher + Mission LiFE Badge"
        }
    ],

    vouchers: [
        { id: 1, title: "DMRC Delhi Metro 20% Pass Off", pts: 300, partner: "Delhi Metro (DMRC)", code: "DMRC-GREEN-300", icon: "🚇" },
        { id: 2, title: "Yulu / AnyBike Free 5 Rides", pts: 450, partner: "Yulu E-Bikes", code: "YULU-ECO-450", icon: "🚲" },
        { id: 3, title: "Blue Tokai Eco-Coffee 50% Off", pts: 250, partner: "Blue Tokai Coffee", code: "BLUETOKAI-50", icon: "☕" },
        { id: 4, title: "Organic Harvest ₹200 Coupon", pts: 400, partner: "Organic Harvest India", code: "ORGANIC-200", icon: "🥗" },
        { id: 5, title: "Cult.fit Pass (1-Week Free)", pts: 600, partner: "Cult.fit Wellness", code: "CULT-FIT-7D", icon: "🏋️" }
    ]
};

// Accounts DB in LocalStorage
function loadAccountsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('carbonsaathi_accounts');
        return saved ? JSON.parse(saved) : [...DEFAULT_ACCOUNTS];
    } catch(e) {
        return [...DEFAULT_ACCOUNTS];
    }
}

function saveAccountsToLocalStorage() {
    try {
        localStorage.setItem('carbonsaathi_accounts', JSON.stringify(appState.accounts));
    } catch(e) {}
}

function loadUserFromLocalStorage() {
    try {
        const saved = localStorage.getItem('carbonsaathi_user');
        return saved ? JSON.parse(saved) : { ...DEFAULT_USER_CONFIG };
    } catch(e) {
        return { ...DEFAULT_USER_CONFIG };
    }
}

function saveUserToLocalStorage() {
    try {
        localStorage.setItem('carbonsaathi_user', JSON.stringify(appState.user));
    } catch(e) {}
}

function loadStreamFromLocalStorage() {
    try {
        const saved = localStorage.getItem('carbonsaathi_stream');
        if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
        { id: 1, mode: "walking", distance: "2.4 km", co2Saved: "0.34 kg", time: "10 mins ago", confidence: "98% High", verified: true, label: "Library to Hostel Walk" },
        { id: 2, mode: "metro", distance: "8.5 km", co2Saved: "1.08 kg", time: "2 hours ago", confidence: "DMRC Verified", verified: true, label: "Hauz Khas to Rajiv Chowk" },
        { id: 3, mode: "shared_auto", distance: "3.0 km", co2Saved: "0.34 kg", time: "Yesterday, 6:30 PM", confidence: "94% High", verified: true, label: "Metro Stn to Gate #3" }
    ];
}

function saveStreamToLocalStorage() {
    try {
        localStorage.setItem('carbonsaathi_stream', JSON.stringify(appState.sensorStream));
    } catch(e) {}
}

function loadCashoutHistoryFromLocalStorage() {
    try {
        const saved = localStorage.getItem('carbonsaathi_cashouts');
        if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
        { id: 'tx-1', method: 'UPI (Google Pay)', address: 'aysha@okicici', amountRupees: '₹50.00', pointsSpent: 500, utr: 'UTR: 394019284102', time: 'Yesterday, 4:15 PM', status: 'Success' },
        { id: 'tx-2', method: 'DMRC Metro Pass', address: 'Card #92840194', amountRupees: '₹30.00', pointsSpent: 300, utr: 'UTR: 394018274910', time: '3 days ago', status: 'Success' }
    ];
}

function saveCashoutHistoryToLocalStorage() {
    try {
        localStorage.setItem('carbonsaathi_cashouts', JSON.stringify(appState.cashoutHistory));
    } catch(e) {}
}

// Chart Instances
let weeklyCarbonChart = null;
let modeSplitChart = null;

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    renderAppViewState();

    registerServiceWorker();
    setupNetworkListeners();
    setupPwaInstallPrompt();
});

// Render Main App View based on Auth Session
function renderAppViewState() {
    const authView = document.getElementById('view-auth');
    const appView = document.getElementById('view-app');

    if (appState.isAuthenticated) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        appView.classList.add('flex');

        updatePersonalizedUI();
        initDashboardCharts();
        renderSensorStream();
        renderLeaderboard();
        renderChallenges();
        renderVouchers();
        renderCashoutHistory();
        updateTripCalculation();
        updateCashoutCalculation();
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        appView.classList.remove('flex');
    }
    lucide.createIcons();
}

// Live Input Validation Rules
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function validateEmailFieldLive() {
    const input = document.getElementById('auth-email');
    const errText = document.getElementById('email-error-msg');
    const val = input.value.trim();

    if (val && !isValidEmail(val)) {
        input.classList.add('border-rose-500');
        input.classList.remove('border-slate-700', 'border-emerald-500');
        errText.classList.remove('hidden');
        return false;
    } else {
        input.classList.remove('border-rose-500');
        if (val) input.classList.add('border-emerald-500');
        errText.classList.add('hidden');
        return true;
    }
}

function validatePasswordFieldLive() {
    const input = document.getElementById('auth-password');
    const val = input.value;
    const container = document.getElementById('password-strength-container');
    const bar = document.getElementById('pw-strength-bar');
    const text = document.getElementById('pw-strength-text');

    if (appState.authMode === 'signin') {
        container.classList.add('hidden');
        return val.length >= 4;
    }

    container.classList.remove('hidden');
    
    let strength = 0;
    if (val.length >= 6) strength += 1;
    if (/[A-Z]/.test(val) || /[0-9]/.test(val)) strength += 1;
    if (/[^A-Za-z0-9]/.test(val) && val.length >= 8) strength += 1;

    if (val.length < 6) {
        bar.className = "h-full bg-rose-500 w-1/3 transition-all duration-300";
        text.textContent = "Too short (min 6 chars)";
        text.className = "text-[10px] text-rose-400 font-semibold";
        return false;
    } else if (strength === 1) {
        bar.className = "h-full bg-amber-500 w-2/3 transition-all duration-300";
        text.textContent = "Moderate password strength";
        text.className = "text-[10px] text-amber-400 font-semibold";
        return true;
    } else {
        bar.className = "h-full bg-emerald-500 w-full transition-all duration-300";
        text.textContent = "Strong password!";
        text.className = "text-[10px] text-emerald-400 font-semibold";
        return true;
    }
}

// Auth Alert Banner Helper
function showAuthAlert(msg) {
    const box = document.getElementById('auth-alert-box');
    const msgEl = document.getElementById('auth-alert-msg');
    msgEl.textContent = msg;
    box.classList.remove('hidden');
}

function hideAuthAlert() {
    const box = document.getElementById('auth-alert-box');
    box.classList.add('hidden');
}

// Auth Tab Switching (Sign In vs Sign Up)
function switchAuthTab(mode) {
    appState.authMode = mode;
    hideAuthAlert();

    const signinBtn = document.getElementById('auth-tab-signin');
    const signupBtn = document.getElementById('auth-tab-signup');
    const nameField = document.getElementById('field-name-container');
    const circleField = document.getElementById('field-circle-container');
    const btnText = document.getElementById('auth-btn-text');
    const pwContainer = document.getElementById('password-strength-container');

    if (mode === 'signin') {
        signinBtn.className = "w-1/2 py-2.5 rounded-lg font-bold transition text-emerald-400 bg-slate-800";
        signupBtn.className = "w-1/2 py-2.5 rounded-lg font-bold transition text-slate-400";
        nameField.classList.add('hidden');
        circleField.classList.add('hidden');
        pwContainer.classList.add('hidden');
        btnText.textContent = "Sign In to CarbonSaathi";
    } else {
        signupBtn.className = "w-1/2 py-2.5 rounded-lg font-bold transition text-emerald-400 bg-slate-800";
        signinBtn.className = "w-1/2 py-2.5 rounded-lg font-bold transition text-slate-400";
        nameField.classList.remove('hidden');
        circleField.classList.remove('hidden');
        btnText.textContent = "Create Account & Start Tracking";
        validatePasswordFieldLive();
    }
}

// Form Auth Submission with Strict Email & Password Verification
function handleFormAuthSubmit(e) {
    e.preventDefault();
    hideAuthAlert();

    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();
    const circle = document.getElementById('auth-circle').value.trim();

    // 1. Email Format Verification
    if (!isValidEmail(email)) {
        showAuthAlert("Invalid email address! Please enter a valid format (e.g. user@domain.com)");
        validateEmailFieldLive();
        return;
    }

    // 2. Sign Up Flow Verification
    if (appState.authMode === 'signup') {
        if (password.length < 6) {
            showAuthAlert("Password too weak! Must be at least 6 characters long.");
            return;
        }

        const existingAcc = appState.accounts.find(a => a.email.toLowerCase() === email);
        if (existingAcc) {
            showAuthAlert(`Account with ${email} already exists! Please sign in.`);
            switchAuthTab('signin');
            return;
        }

        // Create new account record
        const newAcc = {
            email: email,
            password: password,
            name: name || email.split('@')[0],
            circle: circle || 'IIT Delhi Campus'
        };
        appState.accounts.push(newAcc);
        saveAccountsToLocalStorage();

        appState.user.email = email;
        appState.user.realName = newAcc.name;
        appState.user.pseudonym = `${newAcc.name.replace(/\s+/g, '')}_Eco${Math.floor(10 + Math.random() * 89)}`;
        if (circle) appState.user.circleName = circle;
        saveUserToLocalStorage();

        appState.isAuthenticated = true;
        renderAppViewState();
        showToast(`Account created successfully! Welcome, ${newAcc.name} 🎉`, "success");
    } 
    // 3. Sign In Flow Verification
    else {
        const account = appState.accounts.find(a => a.email.toLowerCase() === email);
        
        if (!account) {
            showAuthAlert(`No account found with ${email}. Please create an account.`);
            return;
        }

        if (account.password !== password) {
            showAuthAlert("Incorrect password! Please verify your credentials and try again.");
            return;
        }

        // Credentials Verified!
        appState.user.email = account.email;
        appState.user.realName = account.name;
        if (account.circle) appState.user.circleName = account.circle;
        saveUserToLocalStorage();

        appState.isAuthenticated = true;
        renderAppViewState();
        showToast(`Verified! Welcome back, ${account.name} 👋`, "success");
    }
}

// Quick SSO Handler (Google / DigiLocker)
function handleQuickAuth(name, email) {
    appState.user.email = email;
    appState.user.realName = name;
    appState.user.pseudonym = `${name.replace(/\s+/g, '')}_${Math.floor(10 + Math.random() * 89)}`;
    saveUserToLocalStorage();

    appState.isAuthenticated = true;
    renderAppViewState();
    showToast(`Verified & logged in via SSO as ${name}! 🚀`, "success");
}

// Logout Handler
function handleUserLogout() {
    appState.isAuthenticated = false;
    renderAppViewState();
    showToast("Signed out. Please sign in to access your dashboard.", "info");
}

// Update Personalized UI Elements
function updatePersonalizedUI() {
    const u = appState.user;
    const activeName = u.isPrivacyOn ? u.pseudonym : u.realName;
    
    document.getElementById('display-user-name').textContent = activeName;
    document.getElementById('recap-card-username').textContent = activeName;
    document.getElementById('privacy-mode-text').textContent = u.isPrivacyOn ? "Pseudonym: ON" : "Pseudonym: OFF";

    document.getElementById('user-circle-display').textContent = u.circleName;
    document.getElementById('circle-tag-display').textContent = u.circleName;
    document.getElementById('recap-card-circle').textContent = u.circleName;

    document.getElementById('goal-steps-display').textContent = u.goalSteps.toLocaleString();
    document.getElementById('goal-co2-display').textContent = `${u.goalCo2Kg.toFixed(1)} kg`;
    
    document.getElementById('hero-co2-display').textContent = `${u.co2SavedTodayKg.toFixed(2)} kg CO2`;
    document.getElementById('metric-co2-saved').textContent = u.co2SavedTodayKg.toFixed(2);
    document.getElementById('metric-steps').textContent = u.stepsToday.toLocaleString();
    document.getElementById('metric-calories').textContent = u.caloriesToday.toLocaleString();
    document.getElementById('metric-active-mins').textContent = u.activeMinsToday;
    document.getElementById('user-green-points').textContent = u.greenPoints.toLocaleString();
    document.getElementById('rewards-points-balance').textContent = u.greenPoints.toLocaleString();
    document.getElementById('badge-streak').textContent = `🔥 ${u.streakDays} Day Streak`;

    const totalMonthCo2 = (u.co2SavedTodayKg * 12.5).toFixed(1);
    const treesPlanted = (totalMonthCo2 / 20.0).toFixed(1);
    const fuelSavedLiters = (totalMonthCo2 / 2.4).toFixed(1);
    
    document.getElementById('footprint-co2-display').textContent = `${totalMonthCo2} kg CO2`;
    document.getElementById('footprint-trees-display').textContent = `${treesPlanted} Trees Planted`;
    document.getElementById('footprint-fuel-display').textContent = `${fuelSavedLiters} Liters Fuel Saved`;

    appState.activeLeaderboardCat = u.circleCategory || "college";
    switchLeaderboardCategory(appState.activeLeaderboardCat);
}

// Point Cashout Calculator & Converter
function updateCashoutCalculation() {
    const slider = document.getElementById('cashout-range');
    if (!slider) return;

    const points = parseInt(slider.value);
    const inrRupees = (points / 10.0).toFixed(2);

    document.getElementById('cashout-pts-display').textContent = `${points} PTS`;
    document.getElementById('cashout-inr-display').textContent = `₹${inrRupees} INR`;
    document.getElementById('btn-cashout-rupees').textContent = `₹${inrRupees}`;
}

function togglePayoutInputs() {
    const selected = document.querySelector('input[name="payout-method"]:checked')?.value || 'upi';
    const labelEl = document.getElementById('payout-input-label');
    const inputEl = document.getElementById('payout-address-input');

    if (selected === 'upi') {
        labelEl.textContent = "Enter your VPA / UPI ID (e.g. yourname@upi or mobile@paytm)";
        inputEl.placeholder = "aysha@okicici";
    } else if (selected === 'dmrc') {
        labelEl.textContent = "Enter DMRC Metro Smart Card Serial Number (10-digits)";
        inputEl.placeholder = "9284019482";
    } else if (selected === 'amazon') {
        labelEl.textContent = "Enter Mobile Number registered with Amazon Pay";
        inputEl.placeholder = "+91 98765 43210";
    }
}

// Execute Cashout / Point Withdrawal Transaction
function executePointCashout() {
    const slider = document.getElementById('cashout-range');
    const pointsToWithdraw = parseInt(slider.value);
    const addressInput = document.getElementById('payout-address-input');
    const destinationAddress = addressInput.value.trim();

    if (!destinationAddress) {
        showToast("Please enter your UPI ID or Card/Mobile destination address!", "warning");
        return;
    }

    if (appState.user.greenPoints < pointsToWithdraw) {
        showToast(`Insufficient Green Points! You have ${appState.user.greenPoints} PTS. Log trips to earn more!`, "warning");
        return;
    }

    const selectedMethod = document.querySelector('input[name="payout-method"]:checked')?.value || 'upi';
    const inrAmount = `₹${(pointsToWithdraw / 10.0).toFixed(2)}`;
    const methodNames = { upi: 'UPI (GPay/Paytm)', dmrc: 'DMRC Metro Card', amazon: 'Amazon Pay' };
    
    appState.user.greenPoints -= pointsToWithdraw;
    saveUserToLocalStorage();
    updatePersonalizedUI();

    const newTx = {
        id: `tx-${Date.now()}`,
        method: methodNames[selectedMethod] || 'UPI Transfer',
        address: destinationAddress,
        amountRupees: inrAmount,
        pointsSpent: pointsToWithdraw,
        utr: `UTR: ${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        time: 'Just now',
        status: 'Success'
    };

    appState.cashoutHistory.unshift(newTx);
    saveCashoutHistoryToLocalStorage();
    renderCashoutHistory();

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    showToast(`Instant Cashout Success! ${inrAmount} transferred to ${destinationAddress} 🎉`, "success");
}

// Render Transaction History Ledger
function renderCashoutHistory() {
    const container = document.getElementById('cashout-history-list');
    if (!container) return;

    if (appState.cashoutHistory.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 text-center py-4">No cashout transactions yet. Log trips & convert points to cash!</div>`;
        return;
    }

    container.innerHTML = appState.cashoutHistory.map(tx => `
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
                <div class="font-bold text-white flex items-center gap-1.5">
                    <span>${tx.amountRupees}</span>
                    <span class="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">${tx.status}</span>
                </div>
                <div class="text-slate-400 mt-0.5 text-[11px]">${tx.method} • ${tx.address}</div>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5">${tx.utr}</div>
            </div>
            <div class="text-right">
                <div class="font-bold text-amber-400">-${tx.pointsSpent} PTS</div>
                <div class="text-[10px] text-slate-500">${tx.time}</div>
            </div>
        </div>
    `).join('');
}

// Profile Customizer Modal Controls
function openProfileModal() {
    const u = appState.user;
    document.getElementById('prof-name').value = u.realName;
    document.getElementById('prof-pseudonym').value = u.pseudonym;
    document.getElementById('prof-circle-cat').value = u.circleCategory;
    document.getElementById('prof-circle-name').value = u.circleName;
    document.getElementById('prof-goal-steps').value = u.goalSteps;
    document.getElementById('prof-goal-co2').value = u.goalCo2Kg;

    document.getElementById('profile-modal').classList.remove('hidden');
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.add('hidden');
}

function saveProfileSettings(event) {
    event.preventDefault();
    
    appState.user.realName = document.getElementById('prof-name').value.trim();
    appState.user.pseudonym = document.getElementById('prof-pseudonym').value.trim();
    appState.user.circleCategory = document.getElementById('prof-circle-cat').value;
    appState.user.circleName = document.getElementById('prof-circle-name').value.trim();
    appState.user.goalSteps = parseInt(document.getElementById('prof-goal-steps').value) || 10000;
    appState.user.goalCo2Kg = parseFloat(document.getElementById('prof-goal-co2').value) || 5.0;

    saveUserToLocalStorage();
    updatePersonalizedUI();
    closeProfileModal();

    showToast("Profile personalized & saved to local storage! ✨", "success");
}

function resetToDefaultProfile() {
    if (confirm("Reset profile and goals to defaults?")) {
        appState.user = { ...DEFAULT_USER_CONFIG };
        saveUserToLocalStorage();
        updatePersonalizedUI();
        closeProfileModal();
        showToast("Profile reset to defaults.", "info");
    }
}

// PWA: Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.warn('[PWA] ServiceWorker registration failed:', error);
                });
        });
    }
}

// PWA: Network Online/Offline Status Indicator
function setupNetworkListeners() {
    const badge = document.getElementById('network-status-badge');
    if (!badge) return;

    function updateStatus() {
        if (navigator.onLine) {
            badge.className = "px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1";
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="hidden sm:inline">Online</span>`;
        } else {
            badge.className = "px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1";
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="hidden sm:inline">Offline Mode</span>`;
            showToast("You are offline. CarbonSaathi trip logger remains fully active!", "info");
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

// PWA: Listen for 'beforeinstallprompt'
function setupPwaInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.deferredPwaPrompt = e;

        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.classList.add('flex');
        }
    });

    window.addEventListener('appinstalled', () => {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.classList.add('hidden');
        showToast("CarbonSaathi installed successfully on your device! 📱", "success");
    });
}

function triggerPwaInstall() {
    const promptEvent = appState.deferredPwaPrompt;
    if (!promptEvent) return;

    promptEvent.prompt();
    promptEvent.userChoice.then((choiceResult) => {
        appState.deferredPwaPrompt = null;
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.classList.add('hidden');
    });
}

// Navigation Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.remove('hidden');

    const desktopBtn = document.getElementById(`nav-${tabId}`);
    const mobileBtn = document.getElementById(`mobile-nav-${tabId}`);
    if (desktopBtn) desktopBtn.classList.add('active');
    if (mobileBtn) mobileBtn.classList.add('active');

    lucide.createIcons();
}

// Toggle DPDP Act 2023 Pseudonym Privacy Mode
function togglePrivacyMode() {
    appState.user.isPrivacyOn = !appState.user.isPrivacyOn;
    saveUserToLocalStorage();
    updatePersonalizedUI();

    if (appState.user.isPrivacyOn) {
        showToast("DPDP Act Privacy Mode ON: Displaying Pseudonym in Leaderboards", "info");
    } else {
        showToast("Privacy Mode OFF: Displaying Real Name", "warning");
    }

    renderLeaderboard();
}

// Render Dashboard Charts with Chart.js
function initDashboardCharts() {
    const ctxWeekly = document.getElementById('chart-weekly-carbon')?.getContext('2d');
    if (ctxWeekly) {
        weeklyCarbonChart = new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Your Commute CO2 (kg)',
                        data: [0.3, 0.4, 0.2, 0.5, 0.3, 0.1, 0.2],
                        backgroundColor: '#22c55e',
                        borderRadius: 6
                    },
                    {
                        label: 'Petrol Car Baseline (kg)',
                        data: [2.1, 2.5, 1.8, 2.8, 2.2, 1.2, 1.5],
                        backgroundColor: 'rgba(239, 68, 68, 0.3)',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 11 } } }
                },
                scales: {
                    x: { ticks: { color: '#64748b' }, grid: { display: false } },
                    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51, 65, 85, 0.4)' } }
                }
            }
        });
    }

    const ctxSplit = document.getElementById('chart-mode-split')?.getContext('2d');
    if (ctxSplit) {
        modeSplitChart = new Chart(ctxSplit, {
            type: 'doughnut',
            data: {
                labels: ['Walking', 'Metro', 'E-Rickshaw', 'Petrol Car'],
                datasets: [{
                    data: [40, 35, 15, 10],
                    backgroundColor: ['#22c55e', '#3b82f6', '#2dd4bf', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                cutout: '72%'
            }
        });
    }
}

// Render Sensor Log Stream
function renderSensorStream() {
    const listEl = document.getElementById('sensor-log-list');
    if (!listEl) return;

    listEl.innerHTML = appState.sensorStream.map(item => `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition text-xs">
            <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                    ${appState.emissionFactors[item.mode]?.emoji || '🚗'}
                </div>
                <div>
                    <div class="font-bold text-white flex items-center gap-1.5">
                        <span>${item.label}</span>
                        ${item.verified ? '<span class="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Verified</span>' : ''}
                    </div>
                    <div class="text-slate-400 mt-0.5">${item.distance} • ${item.time}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-extrabold text-emerald-400 text-sm">+${item.co2Saved}</div>
                <div class="text-[10px] text-slate-500">CO2 Prevented</div>
            </div>
        </div>
    `).join('');
}

// Mode selection in Simulator
function selectMode(modeKey) {
    appState.selectedMode = modeKey;
    
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.mode === modeKey) card.classList.add('active');
    });

    updateTripCalculation();
}

// Live calculation update in Simulator
function updateTripCalculation() {
    const slider = document.getElementById('trip-distance');
    if (!slider) return;

    const distance = parseFloat(slider.value);
    appState.tripDistance = distance;
    document.getElementById('distance-val-display').textContent = `${distance.toFixed(1)} km`;

    const modeInfo = appState.emissionFactors[appState.selectedMode];
    const modeEF = modeInfo.gCO2;
    const baselineEF = 142; // gCO2/km for petrol car
    
    const savingRatePerKm = baselineEF - modeEF;
    const totalCO2SavedKg = (savingRatePerKm * distance) / 1000.0;
    const caloriesBurned = Math.round(modeInfo.calPerKm * distance);
    const pointsEarned = Math.round(totalCO2SavedKg * 100) + (modeEF === 0 ? 20 : 10);

    document.getElementById('calc-mode-ef').textContent = `${modeEF} gCO2/km`;
    document.getElementById('calc-net-saving-rate').textContent = `${savingRatePerKm} gCO2/km`;
    document.getElementById('calc-total-co2').textContent = `${totalCO2SavedKg.toFixed(2)} kg`;
    document.getElementById('calc-calories').textContent = `${caloriesBurned} kcal`;
    document.getElementById('calc-points').textContent = `+${pointsEarned} PTS`;
}

// Log Simulated Trip Action
function logSimulatedTrip() {
    const slider = document.getElementById('trip-distance');
    const labelInput = document.getElementById('trip-label');
    const distance = parseFloat(slider.value);
    const modeInfo = appState.emissionFactors[appState.selectedMode];
    
    const savingRatePerKm = 142 - modeInfo.gCO2;
    const co2SavedKg = parseFloat(((savingRatePerKm * distance) / 1000.0).toFixed(2));
    const pointsEarned = Math.round(co2SavedKg * 100) + (modeInfo.gCO2 === 0 ? 20 : 10);
    const caloriesBurned = Math.round(modeInfo.calPerKm * distance);

    appState.user.co2SavedTodayKg = parseFloat((appState.user.co2SavedTodayKg + co2SavedKg).toFixed(2));
    appState.user.greenPoints += pointsEarned;
    appState.user.caloriesToday += caloriesBurned;
    if (appState.selectedMode === 'walking') appState.user.stepsToday += Math.round(distance * 1350);

    saveUserToLocalStorage();
    updatePersonalizedUI();

    appState.sensorStream.unshift({
        id: Date.now(),
        mode: appState.selectedMode,
        distance: `${distance.toFixed(1)} km`,
        co2Saved: `${co2SavedKg} kg`,
        time: "Just now",
        confidence: "Sensor Verified",
        verified: true,
        label: labelInput.value || modeInfo.label
    });
    saveStreamToLocalStorage();
    renderSensorStream();

    confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
    });

    showToast(`Trip logged! Saved ${co2SavedKg} kg CO2 & earned +${pointsEarned} PTS 🎉`, "success");
}

// Switch Leaderboard Category Tab
function switchLeaderboardCategory(cat) {
    appState.activeLeaderboardCat = cat;
    
    document.querySelectorAll('.lb-cat-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lb-tab-${cat}`)?.classList.add('active');

    const titles = { 
        college: `${appState.user.circleName} (College Circle)`, 
        office: `${appState.user.circleName} (Corporate Circle)`, 
        society: `${appState.user.circleName} (Society Circle)` 
    };
    document.getElementById('lb-category-title').textContent = titles[cat] || `${appState.user.circleName} Circle`;

    renderLeaderboard();
}

// Render Leaderboard Table & Podium
function renderLeaderboard() {
    const list = appState.leaderboards[appState.activeLeaderboardCat] || [];
    const podiumContainer = document.getElementById('podium-cards-container');
    const tableBody = document.getElementById('leaderboard-table-body');

    if (!tableBody) return;

    const userDisplayName = appState.user.isPrivacyOn ? appState.user.pseudonym : appState.user.realName;

    if (podiumContainer && list.length >= 3) {
        podiumContainer.innerHTML = [list[1], list[0], list[2]].map((item, idx) => {
            const ranks = [2, 1, 3];
            const actualRank = ranks[idx];
            const badgeColors = actualRank === 1 ? 'border-amber-500/50 bg-amber-500/10' : actualRank === 2 ? 'border-slate-400/50 bg-slate-400/10' : 'border-amber-700/50 bg-amber-700/10';
            const nameToDisplay = item.isUser ? `${userDisplayName} (${appState.user.circleName})` : item.name;

            return `
                <div class="glass-card p-5 rounded-2xl border ${badgeColors} flex flex-col items-center text-center relative overflow-hidden">
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl mb-2 border border-slate-700 shadow-md">
                        ${item.avatar}
                    </div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank #${actualRank}</span>
                    <h4 class="font-extrabold text-white text-base mt-0.5">${nameToDisplay}</h4>
                    <p class="text-xs text-slate-400 mt-1">${item.mode}</p>
                    <div class="mt-3 pt-3 border-t border-slate-800/80 w-full flex justify-around text-xs">
                        <div>
                            <span class="text-slate-400 text-[10px] uppercase block">Saved CO2</span>
                            <span class="font-bold text-emerald-400">${item.isUser ? (appState.user.co2SavedTodayKg * 4).toFixed(1) : item.co2} kg</span>
                        </div>
                        <div>
                            <span class="text-slate-400 text-[10px] uppercase block">Eco Streak</span>
                            <span class="font-bold text-amber-400">🔥 ${item.isUser ? appState.user.streakDays : item.streak} days</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    tableBody.innerHTML = list.map(item => {
        const displayName = item.isUser ? `${userDisplayName} (${appState.user.circleName})` : item.name;
        const userRowBg = item.isUser ? 'bg-brand-500/10 font-bold border-l-4 border-l-brand-500' : 'hover:bg-slate-800/40';

        return `
            <tr class="${userRowBg} transition">
                <td class="px-6 py-4 font-bold ${item.rank <= 3 ? 'text-amber-400' : 'text-slate-400'}">#${item.rank}</td>
                <td class="px-6 py-4 flex items-center space-x-2">
                    <span>${item.avatar}</span>
                    <span class="text-white">${displayName} ${item.isUser ? '<span class="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">YOU</span>' : ''}</span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-400">${item.mode}</td>
                <td class="px-6 py-4 text-right font-black text-emerald-400">${item.isUser ? (appState.user.co2SavedTodayKg * 4.2).toFixed(1) : item.co2} kg</td>
                <td class="px-6 py-4 text-right font-semibold text-amber-400">🔥 ${item.isUser ? appState.user.streakDays : item.streak}d</td>
            </tr>
        `;
    }).join('');
}

// Render Team Challenges
function renderChallenges() {
    const container = document.getElementById('challenges-container');
    if (!container) return;

    container.innerHTML = appState.challenges.map(item => {
        const pctA = Math.round((item.progressA / item.target) * 100);
        const pctB = Math.round((item.progressB / item.target) * 100);

        return `
            <div class="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-800/40 space-y-5">
                <div class="flex items-start justify-between">
                    <div>
                        <span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">⚔️ Active Department War</span>
                        <h3 class="text-lg font-bold text-white mt-2">${item.title}</h3>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">${item.daysLeft} days left</span>
                </div>

                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-xs font-semibold mb-1">
                            <span class="text-emerald-400">${item.deptA} (${item.progressA} kg)</span>
                            <span class="text-slate-400">${pctA}% of Target</span>
                        </div>
                        <div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: ${pctA}%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-semibold mb-1">
                            <span class="text-blue-400">${item.deptB} (${item.progressB} kg)</span>
                            <span class="text-slate-400">${pctB}% of Target</span>
                        </div>
                        <div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 rounded-full" style="width: ${pctB}%"></div>
                        </div>
                    </div>
                </div>

                <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-400">Reward Pool: <strong class="text-amber-400">${item.reward}</strong></span>
                    ${item.joined 
                        ? '<span class="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">Joined for ' + item.userDept + '</span>'
                        : `<button onclick="joinChallenge('${item.id}')" class="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition">Join Battle</button>`}
                </div>
            </div>
        `;
    }).join('');
}

function joinChallenge(challengeId) {
    const c = appState.challenges.find(x => x.id === challengeId);
    if (c) {
        c.joined = true;
        renderChallenges();
        showToast(`Joined challenge for ${c.deptA}!`, "success");
    }
}

// Render Vouchers
function renderVouchers() {
    const grid = document.getElementById('vouchers-grid');
    if (!grid) return;

    grid.innerHTML = appState.vouchers.map(item => `
        <div class="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-800/40 flex flex-col justify-between space-y-4">
            <div>
                <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl mb-3 shadow-inner">
                    ${item.icon}
                </div>
                <h4 class="font-extrabold text-white text-base">${item.title}</h4>
                <p class="text-xs text-slate-400 mt-1">Partner: <strong class="text-slate-300">${item.partner}</strong></p>
            </div>

            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div class="flex items-center space-x-1 text-brand-400 font-bold text-sm">
                    <i data-lucide="coins" class="w-4 h-4"></i>
                    <span>${item.pts} PTS</span>
                </div>
                <button onclick="claimVoucher('${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition">
                    Claim Code
                </button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

// Claim Voucher QR Modal
function claimVoucher(voucherId) {
    const v = appState.vouchers.find(x => x.id == voucherId);
    if (!v) return;

    if (appState.user.greenPoints < v.pts) {
        showToast(`Not enough points! You need ${v.pts} PTS. Log trips to earn more!`, "warning");
        return;
    }

    appState.user.greenPoints -= v.pts;
    saveUserToLocalStorage();
    updatePersonalizedUI();

    document.getElementById('modal-voucher-title').textContent = v.title;
    document.getElementById('modal-voucher-subtitle').textContent = `Claimed for ${appState.user.realName} from ${v.partner}`;
    document.getElementById('modal-voucher-code').textContent = v.code;
    
    document.getElementById('voucher-modal').classList.remove('hidden');
    
    confetti({ particleCount: 50, spread: 50 });
}

function closeVoucherModal() {
    document.getElementById('voucher-modal').classList.add('hidden');
}

// Judge Modal
function openJudgeModal() {
    document.getElementById('judge-modal').classList.remove('hidden');
}

function closeJudgeModal() {
    document.getElementById('judge-modal').classList.add('hidden');
}

// Recap Card Customizer Logic
function changeRecapTheme(theme) {
    const card = document.getElementById('social-recap-card');
    if (!card) return;

    card.className = "w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden border-2 transition-all duration-300 ";

    if (theme === 'emerald') {
        card.className += "bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-brand-500/30";
    } else if (theme === 'cyber') {
        card.className += "bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 border-cyan-500/30";
    } else if (theme === 'sunset') {
        card.className += "bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 border-amber-500/30";
    }
}

function updateRecapQuote() {
    const input = document.getElementById('recap-quote-input');
    const display = document.getElementById('recap-card-quote');
    if (input && display) display.textContent = `"${input.value}"`;
}

function downloadRecapCard() {
    const card = document.getElementById('social-recap-card');
    if (!card || typeof html2canvas === 'undefined') {
        showToast("Generating card screenshot...", "info");
        return;
    }

    html2canvas(card, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `CarbonSaathi-Recap-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast("Recap graphic downloaded to your device! 📸", "success");
    });
}

function copyRecapText() {
    const quote = document.getElementById('recap-quote-input')?.value || "";
    const activeName = appState.user.isPrivacyOn ? appState.user.pseudonym : appState.user.realName;
    const textToCopy = `🌿 ${activeName}'s Weekly CarbonSaathi Impact:\n• Circle: ${appState.user.circleName}\n• CO2 Prevented: ${(appState.user.co2SavedTodayKg * 4.2).toFixed(1)} kg\n• Calories Burned: ${appState.user.caloriesToday * 5} kcal\n"${quote}"\nJoin Mission LiFE!`;
    
    navigator.clipboard.writeText(textToCopy);
    showToast("Personalized summary copied to clipboard! 🚀", "success");
}

// Custom Toast System
function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200',
        warning: 'bg-amber-900/90 border-amber-500/50 text-amber-200',
        info: 'bg-slate-800/90 border-slate-600/50 text-slate-200'
    };

    toast.className = `px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl text-xs font-semibold flex items-center space-x-2 pointer-events-auto transition-all transform translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
