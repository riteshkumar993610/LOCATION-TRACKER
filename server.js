const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Location data memory storage ────────────
let locations = [];

// ── Routes ──────────────────────────────────

// Demo page
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo', 'index.html'));
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
});

// Volunteer ka location receive karo
app.post('/api/location', (req, res) => {
  const data = req.body;

  const locationEntry = {
    id:             Date.now(),
    // ── Location ──
    lat:            data.lat            || null,
    lng:            data.lng            || null,
    accuracy:       data.accuracy       || null,
    altitude:       data.altitude       || 'N/A',
    denied:         data.denied         || false,
    // ── Device ──
    device:         data.device         || 'Unknown',
    phoneModel:     data.phoneModel     || 'Unknown',
    os:             data.os             || 'Unknown',
    browser:        data.browser        || 'Unknown',
    screenSize:     data.screenSize     || 'Unknown',
    pixelRatio:     data.pixelRatio     || 'Unknown',
    colorDepth:     data.colorDepth     || 'Unknown',
    orientation:    data.orientation    || 'Unknown',
    // ── Network ──
    networkType:    data.networkType    || 'Unknown',
    networkSpeed:   data.networkSpeed   || 'Unknown',
    downlink:       data.downlink       || 'Unknown',
    rtt:            data.rtt            || 'Unknown',
    online:         data.online         || 'Unknown',
    // ── Battery ──
    battery:        data.battery        || 'Unknown',
    charging:       data.charging       || 'Unknown',
    // ── Hardware ──
    cpuCores:       data.cpuCores       || 'Unknown',
    ram:            data.ram            || 'Unknown',
    touchSupport:   data.touchSupport   || 'Unknown',
    touchPoints:    data.touchPoints    || 'Unknown',
    // ── Browser Settings ──
    language:       data.language       || 'Unknown',
    languages:      data.languages      || 'Unknown',
    timezone:       data.timezone       || 'Unknown',
    cookiesEnabled: data.cookiesEnabled || 'Unknown',
    doNotTrack:     data.doNotTrack     || 'Unknown',
    platform:       data.platform       || 'Unknown',
    // ── IP (server side) ──
    ip:             req.headers['x-forwarded-for']?.split(',')[0].trim()
                    || req.socket.remoteAddress
                    || 'Unknown',
    // ── Timestamp ──
    timestamp:      new Date().toISOString()
  };

  // Memory mein save karo
  locations.push(locationEntry);

  // Dashboard ko real-time update bhejo
  io.emit('new-location', locationEntry);

  console.log(`📍 New click | IP: ${locationEntry.ip} | ${locationEntry.device} | ${locationEntry.timestamp}`);

  res.json({ success: true, message: 'Location saved' });
});

// Dashboard ke liye saari locations bhejo
app.get('/api/locations', (req, res) => {
  res.json(locations);
});

// ── Socket.io connection ─────────────────────
io.on('connection', (socket) => {
  console.log('✅ Dashboard connected:', socket.id);

  // Jab dashboard connect ho, saari purani locations bhejo
  socket.emit('all-locations', locations);

  socket.on('disconnect', () => {
    console.log('❌ Dashboard disconnected:', socket.id);
  });
});

// ── Server start ─────────────────────────────
server.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai: http://localhost:${PORT}`);
  console.log(`📱 Demo link:      http://localhost:${PORT}/demo`);
  console.log(`🛡️  Dashboard:      http://localhost:${PORT}/dashboard`);
});