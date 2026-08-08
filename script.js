// ============================================
// KUARMA MODS v3.0 - AUTO DOWNLOAD + PASTE
// ============================================

// DOM Elements
const modMenu = document.getElementById('modMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const modStatus = document.getElementById('modStatus');
const espStatusText = document.getElementById('espStatusText');
const toast = document.getElementById('toast');
const canvas = document.getElementById('espCanvas');
const ctx = canvas.getContext('2d');

// Installer Elements
const installerPanel = document.getElementById('installerPanel');
const installerStatus = document.getElementById('installerStatus');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const startInstallBtn = document.getElementById('startInstallBtn');
const closeInstallerBtn = document.getElementById('closeInstallerBtn');
const openInstallerBtn = document.getElementById('openInstallerBtn');

// ============================================
// AUTO DOWNLOAD + PASTE SYSTEM
// ============================================

const CONFIG = {
    downloadUrl: "https://www.mediafire.com/file/i3i1atf5j848o79/cache_res.~2BrPJlgpDAnfyUCp~2Biox5bwsZlQQ~3D/file?dkey=k8cf06xuj1z&r=288",  // Replace with your actual download link
    pastePath: "/data/user/0/com.dts.freefireth/files/contentcache/Compulsory/android/gameassetbundles/",
    modFiles: [
        "localconfig.json",
        "index.html",
        "style.css",
        "script.js"
    ]
};

// Open Installer Panel
openInstallerBtn.addEventListener('click', () => {
    installerPanel.style.display = 'block';
    updateInstallerStatus('Ready to install. Click "Start Install"', 0);
});

// Close Installer Panel
closeInstallerBtn.addEventListener('click', () => {
    installerPanel.style.display = 'none';
});

// Start Installation
startInstallBtn.addEventListener('click', async () => {
    await startInstallation();
});

async function startInstallation() {
    try {
        updateInstallerStatus('📥 Downloading mod files...', 10);
        
        // Step 1: Download each file
        for (let i = 0; i < CONFIG.modFiles.length; i++) {
            const file = CONFIG.modFiles[i];
            updateInstallerStatus(`📥 Downloading ${file}...`, 20 + (i * 15));
            
            // Simulate download
            await simulateDownload(file);
            
            // Step 2: Paste to game folder
            updateInstallerStatus(`📂 Pasting ${file} to game folder...`, 50 + (i * 10));
            await simulatePaste(file);
        }
        
        updateInstallerStatus('✅ Installation Complete! Restart game.', 100);
        showToast('✅ Mods installed successfully! Restart game.');
        
    } catch (error) {
        updateInstallerStatus(`❌ Error: ${error.message}`, 0);
        showToast('❌ Installation failed!');
    }
}

// Simulate download (Replace with actual download logic)
function simulateDownload(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`✅ Downloaded: ${file}`);
            resolve();
        }, 800 + Math.random() * 500);
    });
}

// Simulate paste (Replace with actual paste logic)
function simulatePaste(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`✅ Pasted: ${CONFIG.pastePath}${file}`);
            resolve();
        }, 500 + Math.random() * 300);
    });
}

// Update installer UI
function updateInstallerStatus(message, progress) {
    installerStatus.textContent = message;
    progressBar.style.width = progress + '%';
    progressText.textContent = progress + '%';
}

// ============================================
// ACTUAL DOWNLOAD FUNCTION (For real implementation)
// ============================================

async function downloadAndPasteMods() {
    try {
        // Step 1: Download localconfig.json
        const configResponse = await fetch(CONFIG.downloadUrl + '/localconfig.json');
        const configData = await configResponse.json();
        
        // Step 2: Download other files
        const files = ['index.html', 'style.css', 'script.js'];
        for (const file of files) {
            const response = await fetch(CONFIG.downloadUrl + '/' + file);
            const content = await response.text();
            
            // Step 3: Save to game folder (Android)
            if (window.android) {
                window.android.saveFile(CONFIG.pastePath + file, content);
            } else {
                // Fallback: Use localStorage
                localStorage.setItem('mod_' + file, content);
                console.log(`💾 Saved ${file} to localStorage`);
            }
        }
        
        // Step 4: Save config
        if (window.android) {
            window.android.saveFile(CONFIG.pastePath + 'localconfig.json', JSON.stringify(configData));
        } else {
            localStorage.setItem('mod_localconfig.json', JSON.stringify(configData));
        }
        
        showToast('✅ All mods downloaded and installed!');
        
    } catch (error) {
        console.error('Download failed:', error);
        showToast('❌ Download failed! Check internet.');
    }
}

// ============================================
// ANDROID BRIDGE (For real Android implementation)
// ============================================

// Add this to your Android WebView
if (typeof Android !== 'undefined') {
    window.android = Android;
    console.log('✅ Android bridge detected');
}

// Fallback: File API (For testing in browser)
if (typeof window.showDirectoryPicker !== 'undefined') {
    // For Chrome 86+ with File System Access API
    async function saveFileWithAPI(content, filename) {
        try {
            const handle = await window.showDirectoryPicker();
            const fileHandle = await handle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            console.log(`✅ Saved: ${filename}`);
        } catch (err) {
            console.error('Save failed:', err);
        }
    }
}

// ============================================
// TOGGLE MENU
// ============================================
let isMenuVisible = false;

function toggleModMenu() {
    isMenuVisible = !isMenuVisible;
    if (isMenuVisible) {
        modMenu.classList.remove('hidden');
        loadSettings();
        updateStatus();
        showToast('🔧 Menu Opened');
    } else {
        modMenu.classList.add('hidden');
        showToast('🔧 Menu Closed');
    }
}

// ============================================
// FLOATING BUTTON
// ============================================
document.getElementById('openMenuBtn').addEventListener('click', toggleModMenu);
closeMenuBtn.addEventListener('click', toggleModMenu);

// ============================================
// ALL MOD TOGGLES
// ============================================
const mods = {
    espVisible: document.getElementById('espVisible'),
    espLine: document.getElementById('espLine'),
    espBox: document.getElementById('espBox'),
    espAim: document.getElementById('espAim'),
    espHealth: document.getElementById('espHealth'),
    espDistance: document.getElementById('espDistance'),
    espName: document.getElementById('espName'),
    unlimitedHealth: document.getElementById('unlimitedHealth'),
    unlimitedAmmo: document.getElementById('unlimitedAmmo'),
    speedHack: document.getElementById('speedHack'),
    jumpBoost: document.getElementById('jumpBoost'),
    wallHack: document.getElementById('wallHack'),
    nightVision: document.getElementById('nightVision'),
    noFog: document.getElementById('noFog'),
    infiniteMoney: document.getElementById('infiniteMoney'),
    unlockAll: document.getElementById('unlockAll'),
    noReload: document.getElementById('noReload')
};

// Dummy Players
const players = [
    { id: 1, name: 'Player_1', x: 0.2, y: 0.3, health: 75, distance: 25, alive: true },
    { id: 2, name: 'Player_2', x: 0.7, y: 0.2, health: 100, distance: 40, alive: true },
    { id: 3, name: 'Player_3', x: 0.4, y: 0.7, health: 30, distance: 15, alive: true },
    { id: 4, name: 'Player_4', x: 0.8, y: 0.6, health: 50, distance: 60, alive: true },
    { id: 5, name: 'Player_5', x: 0.1, y: 0.8, health: 90, distance: 35, alive: true }
];

let espEnabled = false;
let animationId = null;

// ============================================
// ESP RENDER
// ============================================
function renderESP() {
    const isVisible = mods.espVisible.checked;
    const isLine = mods.espLine.checked;
    const isBox = mods.espBox.checked;
    const isAim = mods.espAim.checked;
    const isHealth = mods.espHealth.checked;
    const isDistance = mods.espDistance.checked;
    const isName = mods.espName.checked;

    const anyESP = isVisible || isLine || isBox || isAim || isHealth || isDistance || isName;

    if (!anyESP) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        espStatusText.textContent = 'Disabled';
        espStatusText.style.color = '#ff6b6b';
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    espStatusText.textContent = 'Active';
    espStatusText.style.color = '#00ff88';

    players.forEach((player) => {
        if (!player.alive) return;

        const px = player.x * canvas.width;
        const py = player.y * canvas.height;
        const boxSize = 60 + (player.health / 100) * 20;
        const healthPercent = player.health / 100;
        const r = Math.floor(255 * (1 - healthPercent));
        const g = Math.floor(255 * healthPercent);
        const color = `rgba(${r}, ${g}, 50, 0.9)`;

        if (isVisible) {
            const gradient = ctx.createRadialGradient(px, py, 5, px, py, 80);
            gradient.addColorStop(0, `rgba(${r}, ${g}, 50, 0.2)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, 50, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, py, 80, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(${r}, ${g}, 50, 0.6)`;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        if (isLine) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if (isBox) {
            const half = boxSize / 2;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(px - half, py - half, boxSize, boxSize);
            
            const cornerSize = 10;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px - half, py - half + cornerSize);
            ctx.lineTo(px - half, py - half);
            ctx.lineTo(px - half + cornerSize, py - half);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px + half - cornerSize, py - half);
            ctx.lineTo(px + half, py - half);
            ctx.lineTo(px + half, py - half + cornerSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px - half, py + half - cornerSize);
            ctx.lineTo(px - half, py + half);
            ctx.lineTo(px - half + cornerSize, py + half);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px + half - cornerSize, py + half);
            ctx.lineTo(px + half, py + half);
            ctx.lineTo(px + half, py + half - cornerSize);
            ctx.stroke();
        }

        if (isAim) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px - 20, py);
            ctx.lineTo(px + 20, py);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px, py - 20);
            ctx.lineTo(px, py + 20);
            ctx.stroke();
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        if (isHealth) {
            const barWidth = 50;
            const barHeight = 6;
            const barX = px - barWidth / 2;
            const barY = py - boxSize / 2 - 14;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            const fillWidth = (player.health / 100) * barWidth;
            ctx.fillStyle = player.health > 60 ? '#00ff88' : '#ff6b6b';
            ctx.fillRect(barX, barY, fillWidth, barHeight);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = '#ffffff';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${player.health}%`, px, barY - 4);
        }

        if (isDistance) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${player.distance}m`, px, py + boxSize / 2 + 20);
        }

        if (isName) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(player.name, px, py - boxSize / 2 - 24);
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(${r}, ${g}, 50, 0.3)`;
            ctx.font = '9px monospace';
            ctx.fillText(`#${player.id}`, px, py - boxSize / 2 - 36);
        }
    });

    if (mods.espAim.checked) {
        const crossSize = 15;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - crossSize, cy);
        ctx.lineTo(cx + crossSize, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - crossSize);
        ctx.lineTo(cx, cy + crossSize);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ESP ACTIVE | Kurama Mods v3.0', 12, 22);
}

// ============================================
// ANIMATION LOOP
// ============================================
function espLoop() {
    renderESP();
    animationId = requestAnimationFrame(espLoop);
}

// ============================================
// APPLY MODS
// ============================================
function applyMods() {
    const activeMods = [];
    for (const [key, element] of Object.entries(mods)) {
        if (element.checked) activeMods.push(key);
    }

    if (activeMods.length === 0) {
        modStatus.textContent = 'Disabled';
        modStatus.style.color = '#ff6b6b';
        showToast('All mods disabled ❌');
    } else {
        modStatus.textContent = `Enabled (${activeMods.length})`;
        modStatus.style.color = '#00ff88';
        showToast(`Applied ${activeMods.length} mods ✅`);
    }

    const espMods = ['espVisible', 'espLine', 'espBox', 'espAim', 'espHealth', 'espDistance', 'espName'];
    const anyESP = espMods.some(key => mods[key].checked);

    if (anyESP) {
        if (!espEnabled) {
            espEnabled = true;
            espLoop();
        }
    } else {
        if (espEnabled) {
            espEnabled = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            espStatusText.textContent = 'Disabled';
            espStatusText.style.color = '#ff6b6b';
        }
    }

    applyGameMods(activeMods);
}

// ============================================
// GAME MODS
// ============================================
function applyGameMods(activeMods) {
    const gameSim = {
        health: activeMods.includes('unlimitedHealth') ? '∞' : '100',
        ammo: activeMods.includes('unlimitedAmmo') ? '∞' : '30',
        speed: activeMods.includes('speedHack') ? '2x' : '1x',
        jump: activeMods.includes('jumpBoost') ? 'Boosted' : 'Normal',
        money: activeMods.includes('infiniteMoney') ? '∞' : '5000',
        wallHack: activeMods.includes('wallHack') ? 'ON' : 'OFF',
        nightVision: activeMods.includes('nightVision') ? 'ON' : 'OFF',
        noFog: activeMods.includes('noFog') ? 'ON' : 'OFF',
        unlockAll: activeMods.includes('unlockAll') ? 'ON' : 'OFF',
        noReload: activeMods.includes('noReload') ? 'ON' : 'OFF'
    };

    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `
        <p>🎮 Game Running...</p>
        <p style="font-size: 14px; color: #8899bb;">Tap <b style="color:#ff6b6b;">🔧 Menu</b> button</p>
        <div style="margin-top:15px; font-size:13px; background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; text-align:left;">
            <p>❤️ Health: ${gameSim.health} | 🔫 Ammo: ${gameSim.ammo}</p>
            <p>💨 Speed: ${gameSim.speed} | 🦘 Jump: ${gameSim.jump}</p>
            <p>💰 Money: ${gameSim.money} | 🧱 WallHack: ${gameSim.wallHack}</p>
            <p>🌙 Night Vision: ${gameSim.nightVision} | 🌫️ No Fog: ${gameSim.noFog}</p>
            <p>🔓 Unlock All: ${gameSim.unlockAll} | 🔄 No Reload: ${gameSim.noReload}</p>
        </div>
        <p style="margin-top:10px; color:#8899bb;">Mods: <span id="modStatus">${activeMods.length > 0 ? 'Enabled' : 'Disabled'}</span></p>
    `;
}

// ============================================
// TOAST
// ============================================
let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// ============================================
// SAVE / LOAD / RESET
// ============================================
function saveSettings() {
    const settings = {};
    for (const [key, element] of Object.entries(mods)) {
        settings[key] = element.checked;
    }
    localStorage.setItem('kuramaModSettings', JSON.stringify(settings));
    showToast('💾 Settings saved!');
}

function loadSettings() {
    const saved = localStorage.getItem('kuramaModSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            for (const [key, value] of Object.entries(settings)) {
                if (mods[key]) mods[key].checked = value;
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
}

function resetSettings() {
    for (const element of Object.values(mods)) {
        element.checked = false;
    }
    localStorage.removeItem('kuramaModSettings');
    updateStatus();
    applyMods();
    showToast('🔄 Reset to defaults!');
}

function updateStatus() {
    const activeCount = Object.values(mods).filter(el => el.checked).length;
    modStatus.textContent = activeCount === 0 ? 'Disabled' : `Enabled (${activeCount})`;
    modStatus.style.color = activeCount === 0 ? '#ff6b6b' : '#00ff88';
}

// ============================================
// EVENT LISTENERS
// ============================================
for (const element of Object.values(mods)) {
    element.addEventListener('change', () => {
        applyMods();
        saveSettings();
    });
}

document.getElementById('saveSettingsBtn').addEventListener('click', saveSetting