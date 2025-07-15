const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

let logs = []; // memory-based log

app.post('/log-response', (req, res) => {
  const { requestType, userResponse, demo, location } = req.body;

  const suspicious = isSuspiciousLocation(location);
  const result = getResult(requestType, userResponse, suspicious);
  const locationCoords = {
  Ghana: { lat: 7.9465, lng: -1.0232 },
  Nigeria: { lat: 9.0820, lng: 8.6753 },
  Russia: { lat: 61.5240, lng: 105.3188 },
  Brazil: { lat: -14.2350, lng: -51.9253 }
};

const coords = locationCoords[location] || { lat: 0, lng: 0 };

const responseLog = {
  requestType,
  userResponse,
  location,
  suspicious,
  result,
  demo,
  timestamp: Date.now(),
  lat: coords.lat,
  lng: coords.lng
};

// Then push to memory, database, or file:
logs.push(responseLog);
res.json({ success: true, data: responseLog });
  const logEntry = {
    requestType,
    userResponse,
    demo: !!demo,
    location,
    suspicious,
    result,
    timestamp: new Date()
  };

  logs.push(logEntry);
  console.log(logEntry);
  res.status(200).json({ message: 'Logged', data: logEntry });
});

function isSuspiciousLocation(location) {
  const trustedCountries = ["Ghana"];
  return !trustedCountries.includes(location);
}

function getResult(type, response, suspicious) {
  if (suspicious) return "🚨 Mismatched location — Possible spoofing!";
  if (type === 'user' && response === 'yes') return "✔ Code accepted.";
  if (type === 'user' && response === 'no') return "⚠ Suspicious response.";
  if (type === 'attacker' && response === 'yes') return "🚨 Possible attack!";
  return "✅ Code blocked.";
}

// ✅ MOVE THIS OUTSIDE!
app.get('/get-logs', (req, res) => {
  res.json({ logs })
  
});

app.delete('/clear-logs', (req, res) => {
  logs = []; // clears the array
  console.log("🔄 Logs cleared.");
  res.json({ message: "Logs cleared successfully" });
});

app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'group7') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));