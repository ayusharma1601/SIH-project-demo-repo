import codecs
import re

def fix_ui():
    with codecs.open('index.html', 'r', 'utf-8') as f:
        html = f.read()

    # 1. Add nav-profile to sidebar
    nav_recap = '''                    <button onclick="switchTab('recap')" id="nav-recap" class="nav-item w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-r-lg text-xs font-semibold">
                        <i data-lucide="sparkles" class="w-4 h-4 flex-shrink-0"></i>
                        <span class="sidebar-text truncate">Trip Reel & Card</span>
                    </button>'''
    
    nav_profile = '''                    <button onclick="switchTab('profile')" id="nav-profile" class="nav-item w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-r-lg text-xs font-semibold">
                        <i data-lucide="user-circle" class="w-4 h-4 flex-shrink-0"></i>
                        <span class="sidebar-text truncate">Profile & Settings</span>
                    </button>'''
    
    html = html.replace(nav_recap, nav_recap + '\n' + nav_profile)

    # 2. Add tab-profile section
    profile_tab = '''
                <!-- ================= PROFILE TAB ================= -->
                <section id="tab-profile" class="tab-content hidden space-y-6">
                    <div class="min-card p-5 bg-[#102216] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-white flex items-center gap-2">
                                <i data-lucide="user-circle" class="w-5 h-5 text-[#84a956]"></i>
                                Account Settings
                            </h2>
                            <p class="text-xs text-[#c2d6ad] mt-1">Manage your identity, daily goals, and session.</p>
                        </div>
                        <div class="px-3.5 py-2 rounded-lg bg-[#0b1206] border border-[#84a956]/20 flex items-center space-x-3 shadow-md">
                            <div class="w-8 h-8 rounded-full bg-[#5c3a21] text-white flex items-center justify-center font-bold shadow-sm shadow-[#5c3a21]/50">
                                <i data-lucide="user" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-wider text-[#c2d6ad]">Signed in as</p>
                                <p id="tab-prof-email-display" class="text-sm font-bold text-white"></p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profile Form -->
                        <div class="min-card p-6 bg-[#102216] border border-[#84a956]/30">
                            <form onsubmit="saveProfileSettings(event)" class="space-y-4 text-xs">
                                
                                <div class="space-y-3">
                                    <h3 class="font-bold text-white uppercase tracking-wide border-b border-[#84a956]/20 pb-1 mb-2">Display Identity</h3>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">Full Name</label>
                                            <input type="text" id="prof-name" required class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">Pseudonym</label>
                                            <input type="text" id="prof-pseudonym" required class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">Circle Type</label>
                                            <select id="prof-circle-cat" class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                                <option value="college">College Campus</option>
                                                <option value="office">Corporate Office</option>
                                                <option value="society">Housing Society</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">Circle Name</label>
                                            <input type="text" id="prof-circle-name" required class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-3 pt-3">
                                    <h3 class="font-bold text-white uppercase tracking-wide border-b border-[#84a956]/20 pb-1 mb-2">Daily Goals</h3>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">Steps Target</label>
                                            <input type="number" id="prof-goal-steps" min="3000" max="30000" step="500" class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-[#c2d6ad] mb-1">CO2 Target (kg)</label>
                                            <input type="number" id="prof-goal-co2" min="1.0" max="20.0" step="0.5" class="w-full p-2.5 rounded bg-[#0b1206] border border-[#84a956]/30 text-white focus:border-[#84a956] outline-none">
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-5 mt-2 flex justify-end">
                                    <button type="submit" class="px-8 py-2.5 rounded-lg bg-[#5c3a21] hover:bg-[#4a2e1a] text-white font-bold border border-[#84a956]/30 shadow-lg transition">Save Changes</button>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Account Actions -->
                        <div class="min-card p-6 bg-[#102216] border border-[#84a956]/30 flex flex-col space-y-4">
                            <div>
                                <h3 class="font-bold text-rose-300 uppercase tracking-wide border-b border-rose-500/20 pb-1 mb-3">Session Management</h3>
                                <p class="text-xs text-[#c2d6ad] mb-4">You can securely sign out of your account on this device. Your data remains safe on the cloud.</p>
                                <button type="button" onclick="logoutUser()" class="w-full py-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-bold border border-rose-500/30 flex items-center justify-center space-x-2 transition shadow-md">
                                    <i data-lucide="log-out" class="w-4 h-4"></i>
                                    <span>Sign Out of CarbonSaathi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
'''
    
    html = html.replace('            </main>', profile_tab + '\n            </main>')
    
    # 3. Remove old profile-modal
    modal_regex = re.compile(r'    <!-- Profile Modal -->\s*<div id="profile-modal".*?</div>\s*</div>', re.DOTALL)
    html = modal_regex.sub('', html)
    
    # 4. Remove slider icon from top nav
    slider_btn = '''                    <button onclick="openProfileModal()" class="px-3 py-1.5 rounded-lg bg-[#0d281e]/80 border border-[#c2d6ad]/30 text-xs text-[#c2d6ad] hover:border-[#84a956] transition flex items-center space-x-1.5">
                        <i data-lucide="sliders" class="w-3.5 h-3.5 text-[#84a956]"></i>
                        <span class="hidden sm:inline font-semibold">Settings</span>
                    </button>'''
    html = html.replace(slider_btn, '')

    with codecs.open('index.html', 'w', 'utf-8') as f:
        f.write(html)

def fix_css():
    with codecs.open('styles.css', 'r', 'utf-8') as f:
        css = f.read()
        
    sidebar_css = '''
/* Sidebar Collapse (Desktop) */
.sidebar-collapsed {
    width: 80px !important;
}
.sidebar-collapsed .sidebar-text {
    display: none !important;
}
.sidebar-collapsed .nav-item {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
}
.sidebar-collapsed .nav-item i {
    margin-right: 0 !important;
}
.sidebar-collapsed .nav-item span,
.sidebar-collapsed .nav-item div.sidebar-text {
    display: none !important;
}
'''
    if 'sidebar-collapsed' not in css:
        with codecs.open('styles.css', 'a', 'utf-8') as f:
            f.write(sidebar_css)

def fix_js():
    with codecs.open('app.js', 'r', 'utf-8') as f:
        js = f.read()

    js = js.replace('function populateProfileTab() {', 'function OLD_FN() {') # Just in case it was already replaced
    js = js.replace('function openProfileModal() {', 'function populateProfileTab() {')
    js = js.replace("document.getElementById('profile-modal').classList.remove('hidden');", "")
    js = js.replace("document.getElementById('profile-modal').classList.add('hidden');", "")
    
    js = js.replace('const emailDisplay = document.getElementById(\\'prof-email-display\\');', "const emailDisplay = document.getElementById('tab-prof-email-display');")
    
    old_switchTab = '''function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const content = document.getElementById(	ab-);
    if (content) content.classList.remove('hidden');

    const nav = document.getElementById(
av-);
    if (nav) nav.classList.add('active');

    if (window.innerWidth < 768) {
        toggleSidebar();
    }
}'''

    new_switchTab = '''function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const content = document.getElementById(	ab-);
    if (content) content.classList.remove('hidden');

    const nav = document.getElementById(
av-);
    if (nav) nav.classList.add('active');
    
    if (tabId === 'profile') {
        populateProfileTab();
    }

    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
            toggleSidebar();
        }
    }
}'''
    js = js.replace(old_switchTab, new_switchTab)

    with codecs.open('app.js', 'w', 'utf-8') as f:
        f.write(js)

fix_ui()
fix_css()
fix_js()
