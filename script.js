// Kurama Mods - ESP + Mod Menu
const modMenu = document.getElementById('modMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const toast = document.getElementById('toast');
const canvas = document.getElementById('espCanvas');
const ctx = canvas.getContext('2d');

// Mod Toggles
const mods = {
    espVisible: document.getElementById('espVisible'),
    espLine: document.getElementById('espLine'),
    espBox: document.getElementById('espBox'),
    espAim: document.getElementById('espAim'),
    espHealth: document.getElementById('espHealth'),
    espDistance: document.getElementById('espDistance'),
    espName: document.getElementById('espName'),
    unlimitedHealth: document.getElementById('unlimitedHealth'),
    unlimitedAmmo: document.getElementById('unlimitedAmmo')
};

// Dummy Players for ESP
const players = [
    { id: 1, name: 'Player_1', x: 0.2, y: 0.3, health: 75, distance: 25 },
    { id: 2, name: 'Player_2', x: 0.7, y: 0.2, health: 100, distance: 40 },
    { id: 3, name: 'Player_3', x: 0.4, y: 0.7, health: 30, distance: 15 },
    { id: 4, name: 'Player_4', x: 0.8, y: 0.6, health: 50, distance: 60 },
    { id: 5, name: 'Player_5', x: 0.1, y: 0.8, health: 90, distance: 35 }
];

// Toggle Menu
function toggleModMenu() {
    modMenu.classList.toggle('hidden');
}

// Close Menu
closeMenuBtn.addEventListener('click', toggleModMenu);

// Keyboard Shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === 'Insert') {
        e.preventDefault();
        toggleModMenu();
    }
    if (e.key === 'Escape' && !modMenu.classList.contains('hidden')) {
        toggleModMenu();
    }
});

// Render ESP
function renderESP() {
    const isVisible = mods.espVisible.checked;
    const isLine = mods.espLine.checked;
    const isBox = mods.espBox.checked;
    const isAim = mods.espAim.checked;
    const isHealth = mods.espHealth.checked;
    const isDistance = mods.espDistance.checked;
    const isName = mods.espName.checked;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isVisible && !isLine && !isBox && !isAim && !isHealth && !isDistance && !isName) {
        return;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    players.forEach(player => {
        const px = player.x * canvas.width;
        const py = player.y * canvas.height;
        const boxSize = 60 + (player.health / 100) * 20;
        const r = Math.floor(255 * (1 - player.health / 100));
        const g = Math.floor(255 * (player.health / 100));
        const color = `rgba(${r}, ${g}, 50, 0.9)`;

        // ESP Visible
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

        // ESP Line
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

        // ESP Box
        if (isBox) {
            const half = boxSize / 2;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(px - half, py - half, boxSize, boxSize);
        }

        // ESP Aim
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

        // ESP Health
        if (isHealth) {
            const barWidth = 50;
            const barHeight = 6;
            const barX = px - barWidth / 2;
            const barY = py - boxSize / 2 - 14;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            const fillWidth = (player.health / 100) * barWidth;
            ctx.fillStyle = player.health > 60 ? '#00ff88' : '#ff6b6b';
            ctx.fillRect(barX, barY, fillWidth, barHeight);
            ctx.fillStyle = '#ffffff';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${player.health}%`, px, barY - 4);
        }

        // ESP Distance
        if (isDistance) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${player.distance}m`, px, py + boxSize / 2 + 20);
        }

        // ESP Name
        if (isName) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(player.name, px, py - boxSize / 2 - 24);
            ctx.shadowBlur = 0;
        }
    });
}

// Apply Mods
function applyMods() {
    renderESP();
    showToast('✅ Mods applied!');
}

// Save Settings
function saveSettings() {
    const settings = {};
    for (const [key, element] of Object.entries(mods)) {
        settings[key] = element.checked;
    }
    localStorage.setItem('kuramaModSettings', JSON.stringify(settings));
    showToast('💾 Settings saved!');
}

// Load Settings
function loadSettings() {
    const saved = localStorage.getItem('kuramaModSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        for (const [key, value] of Object.entries(settings)) {
            if (mods[key]) mods[key].checked = value;
        }
        renderESP();
    }
}

// Reset Settings
function resetSettings() {
    for (const element of Object.values(mods)) {
        element.checked = false;
    }
    localStorage.removeItem('kuramaModSettings');
    renderESP();
    showToast('🔄 Reset to defaults!');
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// Event Listeners
for (const element of Object.values(mods)) {
    element.addEventListener('change', () => {
        applyMods();
        saveSettings();
    });
}

document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
document.getElementById('resetSettingsBtn').addEventListener('click', resetSettings);

// Window Resize
window.addEventListener('resize', renderESP);

// Initialize
loadSettings();
applyMods();
showToast('🔧 Kurama Mods Ready! Press Insert');

console.log('✅ Kurama Mods v3.0 Loaded');