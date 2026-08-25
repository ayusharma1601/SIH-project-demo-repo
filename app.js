/**
 * CarbonSaathi Application State & Logic
 * Mission LiFE Aligned Personal Carbon & Fitness Tracker (Minimalist UI)
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

// Global State
const appState = {
    isAuthenticated: false,
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
            reward: "500 Green PTS + Free Cafeteria Pass"
        },
        {
            id: 'c2',
            title: "DMRC Metro Drive: North Campus vs South Campus",
            deptA: "DU North Campus",
            deptB: "DU South Campus",
            progressA: 820,
            progressB: 940,
            target: 1200,
            daysLeft: 5,
            joined: false,
            reward: "20% Metro Voucher + Mission LiFE Badge"
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
        { id: 1, mode: "walking", distance: "2.4 km", co2Saved: "0.34 kg", time: "10 mins ago", verified: true, label: "Library to Hostel Walk" },
        { id: 2, mode: "metro", distance: "8.5 km", co2Saved: "1.08 kg", time: "2 hours ago", verified: true, label: "Hauz Khas to Rajiv Chowk" },
        { id: 3, mode: "shared_auto", distance: "3.0 km", co2Saved: "0.34 kg", time: "Yesterday, 6:30 PM", verified: true, label: "Metro Stn to Gate #3" }
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

let weeklyCarbonChart = null;
let modeSplitChart = null;
let polarstepsLeafletMap = null;

const ENV_FACTS = [
    "A single mature tree can absorb over 21 kg of carbon dioxide per year.",
    "Riding a bicycle instead of driving a car for 10 km saves ~2.5 kg of CO2 emissions.",
    "Taking the Metro train emits up to 75% less CO2 per passenger km than a solo petrol car.",
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    "Walking 10,000 steps daily prevents over 1.2 tonnes of CO2 per year if replacing short car trips.",
    "E-Rickshaws in urban hubs slash last-mile transit emissions by over 60%.",
    "Forests cover 31% of global land area and trap over 2.6 billion tonnes of carbon annually."
];

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    renderAppViewState();

    registerServiceWorker();
    setupNetworkListeners();
    setupPwaInstallPrompt();

    // Display random environmental fact on load
    const factTextEl = document.getElementById('env-fact-text');
    if (factTextEl) {
        const randomFact = ENV_FACTS[Math.floor(Math.random() * ENV_FACTS.length)];
        factTextEl.textContent = `"${randomFact}"`;
    }

    // Growing Tree Loading Screen Buffer Timer
    setTimeout(() => {
        const loader = document.getElementById('tree-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 2200);
});

let userLiveGpsMarker = null;

function requestLiveGpsLocation() {
    const btnText = document.getElementById('gps-btn-text');
    const badge = document.getElementById('gps-status-badge');

    if (!('geolocation' in navigator)) {
        showToast("Geolocation is not supported by your browser.", "warning");
        return;
    }

    if (btnText) btnText.textContent = "Acquiring GPS...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            if (btnText) btnText.textContent = "Located Live ✓";
            if (badge) {
                badge.textContent = `Live GPS Active (±${Math.round(accuracy)}m)`;
                badge.className = "px-2 py-0.5 rounded bg-emerald-500/20 text-[#c2d6ad] border border-emerald-500/40 font-bold";
            }

            // Focus map on real personalized GPS coordinates
            if (polarstepsLeafletMap) {
                polarstepsLeafletMap.setView([lat, lng], 15);

                if (userLiveGpsMarker) {
                    userLiveGpsMarker.setLatLng([lat, lng]);
                } else {
                    userLiveGpsMarker = L.circleMarker([lat, lng], {
                        radius: 10,
                        fillColor: '#84a956',
                        color: '#ffffff',
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.9
                    }).addTo(polarstepsLeafletMap);

                    userLiveGpsMarker.bindPopup(`
                        <div style="font-family: sans-serif; font-size: 12px; color: #000; padding: 2px;">
                            <strong>📍 Your Live Location</strong><br/>
                            <span>Accuracy: ±${Math.round(accuracy)} meters</span>
                        </div>
                    `).openPopup();
                }
            }
            showToast(`GPS Position Acquired: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`, "success");
        },
        (error) => {
            if (btnText) btnText.textContent = "Locate Me Live";
            let errMsg = "GPS permission denied or unavailable.";
            if (error.code === error.TIMEOUT) errMsg = "GPS location request timed out.";
            showToast(errMsg, "warning");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function initPolarstepsMap() {
    const mapContainer = document.getElementById('polarsteps-map');
    if (!mapContainer || polarstepsLeafletMap || typeof L === 'undefined') return;

    // Initialize Leaflet map centered at default view
    polarstepsLeafletMap = L.map('polarsteps-map', {
        zoomControl: true,
        scrollWheelZoom: false
    }).setView([28.6139, 77.2090], 12);

    // Dark Mapbox/CartoDB tiles for Polarsteps aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
    }).addTo(polarstepsLeafletMap);

    // Request real personalized GPS position immediately on map init
    if ('geolocation' in navigator) {
        requestLiveGpsLocation();
    }
}

function renderAppViewState() {
    const authView = document.getElementById('view-auth');
    const appView = document.getElementById('view-app');

    if (appState.isAuthenticated) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        appView.classList.add('flex');

        updatePersonalizedUI();
        initDashboardCharts();
        setTimeout(initPolarstepsMap, 200);
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
        errText.classList.remove('hidden');
        return false;
    } else {
        input.classList.remove('border-rose-500');
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
    
    if (val.length < 6) {
        bar.className = "h-full bg-rose-500 w-1/4 transition-all duration-300";
        text.textContent = "Too short (min 6 chars)";
        text.className = "text-[10px] text-rose-400 font-semibold";
        return false;
    }

    // Common weak patterns check (e.g., 12345678, password, qwerty, repeated chars)
    const commonWeakPatterns = [/^(12345|123456|1234567|12345678|123456789|012345|qwerty|password|abcdef|111111|000000)$/i];
    const isSequentialOrRepetitive = commonWeakPatterns.some(pattern => pattern.test(val)) || /^(\w)\1+$/.test(val);

    if (isSequentialOrRepetitive) {
        bar.className = "h-full bg-rose-500 w-1/4 transition-all duration-300";
        text.textContent = "Weak password";
        text.className = "text-[10px] text-rose-400 font-semibold";
        return false;
    }

    // Score calculation based on complexity criteria
    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score += 1; // Mixed case
    if (/\d/.test(val)) score += 1; // Has digit
    if (/[^A-Za-z0-9]/.test(val)) score += 1; // Has special char

    if (score <= 1) {
        bar.className = "h-full bg-rose-500 w-2/4 transition-all duration-300";
        text.textContent = "Weak password";
        text.className = "text-[10px] text-rose-400 font-semibold";
        return false;
    } else if (score === 2) {
        bar.className = "h-full bg-[#84a956] w-3/4 transition-all duration-300";
        text.textContent = "Moderate strength";
        text.className = "text-[10px] text-[#c2d6ad] font-semibold";
        return true;
    } else {
        bar.className = "h-full bg-emerald-500 w-full transition-all duration-300";
        text.textContent = "Strong password! 🔒";
        text.className = "text-[10px] text-[#c2d6ad] font-semibold";
        return true;
    }
}

function showAuthAlert(msg) {
    const box = document.getElementById('auth-alert-box');
    const msgEl = document.getElementById('auth-alert-msg');
    msgEl.textContent = msg;
    box.classList.remove('hidden');
}

function hideAuthAlert() {
    document.getElementById('auth-alert-box').classList.add('hidden');
}

function switchAuthTab(mode) {
    appState.authMode = mode;
    hideAuthAlert();

    const signinBtn = document.getElementById('auth-tab-signin');
    const signupBtn = document.getElementById('auth-tab-signup');
    const nameField = document.getElementById('field-name-container');
    const circleField = document.getElementById('field-circle-container');
    const btnText = document.getElementById('auth-btn-text');

    if (mode === 'signin') {
        signinBtn.className = "w-1/2 py-2 rounded-md font-bold transition text-[#84a956] bg-[#102216]";
        signupBtn.className = "w-1/2 py-2 rounded-md font-bold transition text-gray-400";
        nameField.classList.add('hidden');
        circleField.classList.add('hidden');
        btnText.textContent = "Sign In to CarbonSaathi";
    } else {
        signupBtn.className = "w-1/2 py-2 rounded-md font-bold transition text-[#84a956] bg-[#102216]";
        signinBtn.className = "w-1/2 py-2 rounded-md font-bold transition text-gray-400";
        nameField.classList.remove('hidden');
        circleField.classList.remove('hidden');
        btnText.textContent = "Create Account & Start Tracking";
    }
}

function showOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    const card = document.getElementById('onboarding-card');
    document.getElementById('view-auth').classList.add('hidden');
    modal.classList.remove('hidden');
    // slight delay for animation
    setTimeout(() => {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 50);
}

function closeOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    modal.classList.add('hidden');
    showView('view-dashboard');
    // trigger tree loader for dramatic effect
    const loader = document.getElementById('tree-loader');
    loader.classList.remove('hidden');
    setTimeout(() => { loader.classList.add('opacity-0'); }, 1500);
    setTimeout(() => { loader.classList.add('hidden'); loader.classList.remove('opacity-0'); }, 2000);
}

function handleFormAuthSubmit(e) {
    e.preventDefault();
    hideAuthAlert();

    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();
    const circle = document.getElementById('auth-circle').value.trim();

    if (!isValidEmail(email)) {
        showAuthAlert("Invalid email format!");
        return;
    }

    if (appState.authMode === 'signup') {
        if (password.length < 6) {
            showAuthAlert("Password must be at least 6 chars.");
            return;
        }

        const existingAcc = appState.accounts.find(a => a.email.toLowerCase() === email);
        if (existingAcc) {
            showAuthAlert(`Account with ${email} already exists!`);
            switchAuthTab('signin');
            return;
        }

        const newAcc = { email, password, name: name || email.split('@')[0], circle: circle || 'IIT Delhi Campus' };
        appState.accounts.push(newAcc);
        saveAccountsToLocalStorage();

        appState.user.email = email;
        appState.user.realName = newAcc.name;
        appState.user.pseudonym = `${newAcc.name.replace(/\s+/g, '')}_Eco${Math.floor(10 + Math.random() * 89)}`;
        if (circle) appState.user.circleName = circle;
        saveUserToLocalStorage();

        appState.isAuthenticated = true;
        // Show onboarding modal instead of going directly to dashboard
        showOnboarding();
        showToast(`Welcome to CarbonSaathi, ${newAcc.name}! 🎉`, "success");
    } else {
        const account = appState.accounts.find(a => a.email.toLowerCase() === email);
        if (!account) {
            showAuthAlert(`No account found for ${email}. Please sign up.`);
            return;
        }
        if (account.password !== password) {
            showAuthAlert("Incorrect password!");
            return;
        }

        appState.user.email = account.email;
        appState.user.realName = account.name;
        if (account.circle) appState.user.circleName = account.circle;
        saveUserToLocalStorage();

        appState.isAuthenticated = true;
        renderAppViewState();
        showToast(`Welcome back, ${account.name}! 👋`, "success");
    }
}

function handleQuickAuth(name, email) {
    appState.user.email = email;
    appState.user.realName = name;
    appState.user.pseudonym = `${name.replace(/\s+/g, '')}_${Math.floor(10 + Math.random() * 89)}`;
    saveUserToLocalStorage();

    appState.isAuthenticated = true;
    renderAppViewState();
    showToast(`Logged in via SSO as ${name}! 🚀`, "success");
}

function handleUserLogout() {
    appState.isAuthenticated = false;
    renderAppViewState();
    showToast("Signed out.", "info");
}

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
    document.getElementById('footprint-trees-display').textContent = `${treesPlanted} Trees`;
    document.getElementById('footprint-fuel-display').textContent = `${fuelSavedLiters} L`;

    appState.activeLeaderboardCat = u.circleCategory || "college";
    switchLeaderboardCategory(appState.activeLeaderboardCat);
}

function updateCashoutCalculation() {
    const slider = document.getElementById('cashout-range');
    if (!slider) return;

    const points = parseInt(slider.value);
    const inrRupees = (points / 10.0).toFixed(2);

    document.getElementById('cashout-pts-display').textContent = `${points} PTS`;
    document.getElementById('cashout-inr-display').textContent = `₹${inrRupees}`;
    document.getElementById('btn-cashout-rupees').textContent = `₹${inrRupees}`;
}

function togglePayoutInputs() {
    const selected = document.querySelector('input[name="payout-method"]:checked')?.value || 'upi';
    const labelEl = document.getElementById('payout-input-label');
    const inputEl = document.getElementById('payout-address-input');

    if (selected === 'upi') {
        labelEl.textContent = "Enter your VPA / UPI ID";
        inputEl.placeholder = "aysha@okicici";
    } else if (selected === 'dmrc') {
        labelEl.textContent = "Enter DMRC Smart Card Serial Number";
        inputEl.placeholder = "9284019482";
    } else if (selected === 'amazon') {
        labelEl.textContent = "Enter Amazon Pay Mobile Number";
        inputEl.placeholder = "+91 98765 43210";
    }
}

function executePointCashout() {
    const slider = document.getElementById('cashout-range');
    const pointsToWithdraw = parseInt(slider.value);
    const addressInput = document.getElementById('payout-address-input');
    const destinationAddress = addressInput.value.trim();

    if (!destinationAddress) {
        showToast("Please enter destination address!", "warning");
        return;
    }

    if (appState.user.greenPoints < pointsToWithdraw) {
        showToast("Insufficient Green Points!", "warning");
        return;
    }

    const selectedMethod = document.querySelector('input[name="payout-method"]:checked')?.value || 'upi';
    const inrAmount = `₹${(pointsToWithdraw / 10.0).toFixed(2)}`;
    const methodNames = { upi: 'UPI', dmrc: 'DMRC Card', amazon: 'Amazon Pay' };
    
    appState.user.greenPoints -= pointsToWithdraw;
    saveUserToLocalStorage();
    updatePersonalizedUI();

    const newTx = {
        id: `tx-${Date.now()}`,
        method: methodNames[selectedMethod] || 'UPI',
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

    confetti({ particleCount: 80, spread: 60 });
    showToast(`Transferred ${inrAmount} to ${destinationAddress} 🎉`, "success");
}

function renderCashoutHistory() {
    const container = document.getElementById('cashout-history-list');
    if (!container) return;

    if (appState.cashoutHistory.length === 0) {
        container.innerHTML = `<div class="text-xs text-gray-500 text-center py-3">No cashouts yet.</div>`;
        return;
    }

    container.innerHTML = appState.cashoutHistory.map(tx => `
        <div class="p-2.5 rounded-lg bg-[#0e0e11] border border-[#24242c] flex items-center justify-between text-xs font-mono-num">
            <div>
                <div class="font-bold text-white flex items-center gap-1">
                    <span>${tx.amountRupees}</span>
                    <span class="text-[9px] text-[#84a956] bg-[#84a956]/10 px-1 py-0.2 rounded border border-[#84a956]/20">${tx.status}</span>
                </div>
                <div class="text-gray-400 text-[10px]">${tx.method} • ${tx.address}</div>
            </div>
            <div class="text-right">
                <div class="font-bold text-[#c2d6ad]">-${tx.pointsSpent} PTS</div>
                <div class="text-[9px] text-gray-500">${tx.time}</div>
            </div>
        </div>
    `).join('');
}

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
    showToast("Profile saved!", "success");
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }
}

function setupNetworkListeners() {
    const badge = document.getElementById('network-status-badge');
    if (!badge) return;

    function updateStatus() {
        if (navigator.onLine) {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#c2d6ad] animate-pulse"></span> Network: Online`;
        } else {
            badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#5c3a21]"></span> Network: Offline`;
        }
    }
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

function setupPwaInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.deferredPwaPrompt = e;
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.classList.remove('hidden');
    });
}

function triggerPwaInstall() {
    if (appState.deferredPwaPrompt) {
        appState.deferredPwaPrompt.prompt();
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.remove('hidden');

    const desktopBtn = document.getElementById(`nav-${tabId}`);
    if (desktopBtn) desktopBtn.classList.add('active');

    // Auto-close sidebar drawer when selecting a menu option on mobile screen sizes
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && window.innerWidth < 768) {
        sidebar.classList.add('-translate-x-full');
        if (overlay) {
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    lucide.createIcons();
}

function togglePrivacyMode() {
    appState.user.isPrivacyOn = !appState.user.isPrivacyOn;
    saveUserToLocalStorage();
    updatePersonalizedUI();
    renderLeaderboard();
}

// Chart.js Configuration with Vibrant Orange & Electric Purple Palette
function initDashboardCharts() {
    const ctxWeekly = document.getElementById('chart-weekly-carbon')?.getContext('2d');
    if (ctxWeekly) {
        weeklyCarbonChart = new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Your CO2 Saved (kg)',
                        data: [0.3, 0.4, 0.2, 0.5, 0.3, 0.1, 0.2],
                        backgroundColor: '#5c3a21',
                        borderRadius: 4
                    },
                    {
                        label: 'Petrol Baseline (kg)',
                        data: [2.1, 2.5, 1.8, 2.8, 2.2, 1.2, 1.5],
                        backgroundColor: 'rgba(132, 169, 86, 0.3)',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#9ca3af', font: { size: 10 } } }
                },
                scales: {
                    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                    y: { ticks: { color: '#6b7280' }, grid: { color: '#24242c' } }
                }
            }
        });
    }

    const ctxSplit = document.getElementById('chart-mode-split')?.getContext('2d');
    if (ctxSplit) {
        modeSplitChart = new Chart(ctxSplit, {
            type: 'doughnut',
            data: {
                labels: ['Walking', 'Metro', 'E-Rick', 'Car'],
                datasets: [{
                    data: [40, 35, 15, 10],
                    backgroundColor: ['#5c3a21', '#84a956', '#c2d6ad', '#c2d6ad'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '75%'
            }
        });
    }
}

function renderSensorStream() {
    const listEl = document.getElementById('sensor-log-list');
    if (!listEl) return;

    listEl.innerHTML = appState.sensorStream.map(item => `
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0e11] border border-[#24242c] text-xs">
            <div class="flex items-center space-x-2.5">
                <div class="w-7 h-7 rounded bg-[#1c1c22] flex items-center justify-center text-sm">
                    ${appState.emissionFactors[item.mode]?.emoji || '🚗'}
                </div>
                <div>
                    <div class="font-bold text-white flex items-center gap-1">
                        <span>${item.label}</span>
                    </div>
                    <div class="text-gray-500 text-[10px]">${item.distance} • ${item.time}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-extrabold text-[#84a956] font-mono-num">+${item.co2Saved}</div>
            </div>
        </div>
    `).join('');
}

function selectMode(modeKey) {
    appState.selectedMode = modeKey;
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.mode === modeKey) card.classList.add('active');
    });
    updateTripCalculation();
}

function updateTripCalculation() {
    const slider = document.getElementById('trip-distance');
    if (!slider) return;

    const distance = parseFloat(slider.value);
    appState.tripDistance = distance;
    document.getElementById('distance-val-display').textContent = `${distance.toFixed(1)} km`;

    const modeInfo = appState.emissionFactors[appState.selectedMode];
    const modeEF = modeInfo.gCO2;
    const savingRatePerKm = 142 - modeEF;
    const totalCO2SavedKg = (savingRatePerKm * distance) / 1000.0;
    const caloriesBurned = Math.round(modeInfo.calPerKm * distance);
    const pointsEarned = Math.round(totalCO2SavedKg * 100) + (modeEF === 0 ? 20 : 10);

    document.getElementById('calc-mode-ef').textContent = `${modeEF} gCO2/km`;
    document.getElementById('calc-net-saving-rate').textContent = `${savingRatePerKm} gCO2/km`;
    document.getElementById('calc-total-co2').textContent = `${totalCO2SavedKg.toFixed(2)} kg`;
    document.getElementById('calc-calories').textContent = `${caloriesBurned} kcal`;
    document.getElementById('calc-points').textContent = `+${pointsEarned} PTS`;
}

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
        verified: true,
        label: labelInput.value || modeInfo.label
    });
    saveStreamToLocalStorage();
    renderSensorStream();

    confetti({ particleCount: 70, spread: 50 });
    showToast(`Trip logged! +${co2SavedKg} kg CO2 & +${pointsEarned} PTS 🎉`, "success");
}

function switchLeaderboardCategory(cat) {
    appState.activeLeaderboardCat = cat;
    document.querySelectorAll('.lb-cat-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lb-tab-${cat}`)?.classList.add('active');

    const titles = { college: `${appState.user.circleName} Circle`, office: `${appState.user.circleName} Circle`, society: `${appState.user.circleName} Circle` };
    document.getElementById('lb-category-title').textContent = titles[cat] || appState.user.circleName;
    renderLeaderboard();
}

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
            const nameToDisplay = item.isUser ? `${userDisplayName}` : item.name;

            return `
                <div class="min-card p-4 bg-[#102216] border-b-2 ${actualRank === 1 ? 'border-[#5c3a21]' : 'border-[#2a3a20]'} text-center space-y-2">
                    <span class="text-[10px] font-mono-num font-bold text-gray-400">RANK #${actualRank}</span>
                    <h4 class="font-bold text-white text-sm truncate">${nameToDisplay}</h4>
                    <div class="text-xs text-[#84a956] font-mono-num font-extrabold">${item.isUser ? (appState.user.co2SavedTodayKg * 4).toFixed(1) : item.co2} kg CO2</div>
                </div>
            `;
        }).join('');
    }

    tableBody.innerHTML = list.map(item => {
        const displayName = item.isUser ? `${userDisplayName}` : item.name;
        const userRowBg = item.isUser ? 'bg-[#5c3a21]/10 font-bold border-l-2 border-l-[#5c3a21]' : 'hover:bg-[#0b1206]';

        return `
            <tr class="${userRowBg} transition">
                <td class="px-5 py-3 font-bold font-mono-num ${item.rank <= 3 ? 'text-[#84a956]' : 'text-gray-400'}">#${item.rank}</td>
                <td class="px-5 py-3 text-white">${displayName} ${item.isUser ? '<span class="text-[9px] bg-[#5c3a21]/20 text-[#c2d6ad] px-1 py-0.2 rounded">YOU</span>' : ''}</td>
                <td class="px-5 py-3 text-gray-400">${item.mode}</td>
                <td class="px-5 py-3 text-right font-mono-num font-bold text-[#84a956]">${item.isUser ? (appState.user.co2SavedTodayKg * 4.2).toFixed(1) : item.co2} kg</td>
                <td class="px-5 py-3 text-right font-mono-num text-[#c2d6ad]">🔥 ${item.isUser ? appState.user.streakDays : item.streak}d</td>
            </tr>
        `;
    }).join('');
}

function renderChallenges() {
    const container = document.getElementById('challenges-container');
    if (!container) return;

    container.innerHTML = appState.challenges.map(item => `
        <div class="min-card p-5 bg-[#16161a] space-y-4">
            <div class="flex justify-between items-start">
                <h3 class="text-sm font-bold text-white">${item.title}</h3>
                <span class="text-[10px] text-gray-400 font-mono">${item.daysLeft}d left</span>
            </div>
            <div class="space-y-2 text-xs">
                <div class="flex justify-between text-gray-300">
                    <span>${item.deptA}</span>
                    <span class="font-mono-num text-[#84a956]">${item.progressA} kg</span>
                </div>
                <div class="w-full h-1.5 bg-[#0e0e11] rounded-full overflow-hidden">
                    <div class="h-full bg-[#5c3a21]" style="width: ${Math.round((item.progressA / item.target) * 100)}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderVouchers() {
    const grid = document.getElementById('vouchers-grid');
    if (!grid) return;

    grid.innerHTML = appState.vouchers.map(item => `
        <div class="min-card p-4 bg-[#16161a] flex flex-col justify-between space-y-3">
            <div>
                <span class="text-xl">${item.icon}</span>
                <h4 class="font-bold text-white text-xs mt-1">${item.title}</h4>
                <p class="text-[10px] text-gray-400 mt-0.5">${item.partner}</p>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-[#24242c]">
                <span class="text-xs font-bold text-[#84a956] font-mono-num">${item.pts} PTS</span>
                <button onclick="claimVoucher('${item.id}')" class="px-2.5 py-1 rounded bg-[#1c1c22] border border-[#2a2a34] text-xs text-white font-bold">Claim</button>
            </div>
        </div>
    `).join('');
}

function claimVoucher(voucherId) {
    const v = appState.vouchers.find(x => x.id == voucherId);
    if (!v) return;

    if (appState.user.greenPoints < v.pts) {
        showToast("Not enough points!", "warning");
        return;
    }

    v.claimed = true;
    appState.user.greenPoints -= v.pts;
    saveUserToLocalStorage();
    renderVouchers();
    updatePersonalizedUI();
    showToast(`Claimed ${v.title}! 🎁`, "success");

    // Prompt user to share milestone
    setTimeout(() => {
        openModal('modal-recap');
        const input = document.getElementById('recap-quote-input');
        if (input) {
            input.value = `I just claimed a ${v.title} reward on CarbonSaathi! 🌿`;
            updateRecapQuote();
        }
    }, 1500);

    document.getElementById('modal-voucher-title').textContent = v.title;
    document.getElementById('modal-voucher-subtitle').textContent = `Claimed from ${v.partner}`;
    document.getElementById('modal-voucher-code').textContent = v.code;
    document.getElementById('voucher-modal').classList.remove('hidden');
}

function closeVoucherModal() {
    document.getElementById('voucher-modal').classList.add('hidden');
}

function changeRecapTheme(theme) {
    const card = document.getElementById('social-recap-card');
    if (!card) return;
    if (theme === 'emerald') card.className = "w-full max-w-md p-6 rounded-2xl bg-[#102216] border-2 border-[#5c3a21]/40 shadow-2xl space-y-5 relative overflow-hidden";
    else if (theme === 'cyber') card.className = "w-full max-w-md p-6 rounded-2xl bg-[#102216] border-2 border-[#84a956]/40 shadow-2xl space-y-5 relative overflow-hidden";
    else card.className = "w-full max-w-md p-6 rounded-2xl bg-[#102216] border-2 border-[#c2d6ad]/40 shadow-2xl space-y-5 relative overflow-hidden";
}

function updateRecapQuote() {
    const input = document.getElementById('recap-quote-input');
    const display = document.getElementById('recap-card-quote');
    if (input && display) display.textContent = `"${input.value}"`;
}

function downloadRecapCard() {
    const card = document.getElementById('social-recap-card');
    if (!card || typeof html2canvas === 'undefined') return;
    html2canvas(card, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `CarbonSaathi-Recap-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast("Recap downloaded! 📸", "success");
    });
}

function copyRecapText() {
    const quote = document.getElementById('recap-quote-input')?.value || "";
    const activeName = appState.user.isPrivacyOn ? appState.user.pseudonym : appState.user.realName;
    const textToCopy = `🌿 ${activeName}'s Impact: Saved ${(appState.user.co2SavedTodayKg * 4.2).toFixed(1)} kg CO2! "${quote}" #CarbonSaathi`;
    navigator.clipboard.writeText(textToCopy);
    showToast("Summary copied!", "success");
}

function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-[#102216] border-[#5c3a21] text-gray-100',
        warning: 'bg-[#102216] border-[#84a956] text-[#c2d6ad]',
        info: 'bg-[#102216] border-[#2a3a20] text-gray-200'
    };

    toast.className = `px-3.5 py-2.5 rounded-lg border backdrop-blur-md shadow-2xl text-xs font-bold transition-all transform translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Retractable Sidebar Toggle Controllers
function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    const isMobileHidden = sidebar.classList.contains('-translate-x-full');
    if (isMobileHidden) {
        sidebar.classList.remove('-translate-x-full');
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
    } else {
        sidebar.classList.add('-translate-x-full');
        if (overlay) {
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }
}

function toggleSidebarDesktop() {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-collapsed');
}
