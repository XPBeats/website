// auth.js
const DISCORD_CLIENT_ID = "1439059444179665106";
const DISCORD_REDIRECT_URI = "https://xplab.shop/callback";

let currentUser = null;

// Start Discord Login
function loginWithDiscord() {
  const url = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
  window.location.href = url;
}

// Handle Callback
async function handleDiscordCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (!code) return;

  document.body.innerHTML = `
    <div style="color:#00ff41;text-align:center;margin-top:20vh;font-family:monospace;font-size:1.2rem;">
      Verifying access...
    </div>`;

  try {
    const res = await fetch('/api/discord-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('xplab_user', JSON.stringify(currentUser));
      enterDashboard();
      history.replaceState(null, null, '/');
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    alert("Access denied. Admin only.");
    window.location.href = '/';
  }
}

// Email Login (Legacy)
function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (email === "admin@lab" && password === "SynBeauloGod00") {
    currentUser = { name: "SynBeauloGod00", role: "admin" };
    enterDashboard();
  } else {
    alert("Access denied.");
  }
}

// Enter Dashboard
function enterDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('user-info').innerHTML = `
    <div style="color:#00ff41">Admin: ${currentUser.name}</div>
    ${currentUser.discord ? '<div style="font-size:0.8rem;color:#666;margin-top:4px;">via Discord</div>' : ''}
  `;
  renderProducts();
  renderUsers();
}

function logout() {
  localStorage.removeItem('xplab_user');
  currentUser = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

// Auto-load user on page load
window.addEventListener('load', () => {
  const saved = localStorage.getItem('xplab_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    enterDashboard();
  }
});

// Run on callback
if (window.location.pathname === '/callback') {
  handleDiscordCallback();
}