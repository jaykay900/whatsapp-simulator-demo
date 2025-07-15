const scenarios = ["user", "attacker"];
const requestType = scenarios[Math.floor(Math.random() * scenarios.length)];
const scenarioText = document.getElementById("scenarioText");
const result = document.getElementById("result");

if (!localStorage.getItem("adminToken")) {
  document.getElementById("viewLogsBtn").style.display = "none";
  document.getElementById("clearLogsBtn").style.display = "none";
}

let fakeMessage = "";

if (requestType === "attacker") {
  const attackerMessages = [
    "Hey! Just trying to log in from my backup phone — approve the code real quick.",
    "It’s you, right? The account just asked for a login from Accra. Tap YES to continue.",
    "Your WhatsApp security check requires your confirmation. Denying may disable your account.",
    "New session attempt detected. Approval required to avoid suspension.",
    "⚠️ This OTP was triggered by a system check. Confirm YES to keep access alive."
  ];
  fakeMessage = attackerMessages[Math.floor(Math.random() * attackerMessages.length)];
}

scenarioText.innerHTML = `
  <strong>🔔 OTP Request Triggered</strong><br>
  <strong>Source:</strong> ${requestType === "user" ? "YOU" : "UNKNOWN"}<br><br>
  ${fakeMessage ? `<em>💬 Message:</em> "${fakeMessage}"` : "Did you request this code?"}
`;
const demoToggle = document.getElementById("demoToggle");

function logResponse(userResponse) {
  const isDemo = demoToggle?.checked;
  const location = isDemo
    ? ["Ghana", "Nigeria", "Russia", "Brazil"][Math.floor(Math.random() * 4)]
    : "Ghana"; // Assume real users are in Ghana

  fetch('/log-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestType, userResponse, demo: isDemo, location })
  })
  .then(res => res.json())
  .then(data => {
    if (data.data.compromised) {
  document.body.innerHTML = `
    <div style="padding: 50px; text-align: center;">
      <h2 style="color: red;">💥 SYSTEM COMPROMISED</h2>
      <p>The OTP was accepted by an outside attacker. Your session is no longer secure.</p>
      <button onclick="location.reload()" style="padding:10px 20px; background:red; color:white; border:none; border-radius:5px;">🔁 Restart Simulation</button>
    </div>
  `;
  return; // Stop further UI rendering
}
  console.log('Logged:', data);
  
  // 🆕 Display feedback to user
  const feedbackBox = document.getElementById('user-feedback');
  feedbackBox.innerHTML = `
    <h3>Your Feedback</h3>
    <p><strong>Request Type:</strong> ${data.data.requestType}</p>
    <p><strong>Your Response:</strong> ${data.data.userResponse}</p>
    <p><strong>Location:</strong> ${data.data.location}</p>
    <p><strong>Suspicious:</strong> ${data.data.suspicious ? 'Yes 🚩' : 'No ✅'}</p>
    <p><strong>Result:</strong> ${data.data.result}</p>
  `;
  feedbackBox.style.display = 'block';
});
}

document.getElementById("yesBtn").onclick = () => logResponse("yes");
document.getElementById("noBtn").onclick = () => logResponse("no");

document.getElementById("viewLogsBtn").onclick = () => {
  fetch('/get-logs')
    .then(res => res.json())
    .then(data => {
      const viewer = document.getElementById("logViewer");
      const map = L.map('map').setView([0, 0], 2); // World view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

data.logs.forEach(log => {
  // Optional: Only show suspicious
  if (log.suspicious && log.lat && log.lng) {
    L.circleMarker([log.lat, log.lng], {
      radius: 8,
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5
    })
    .bindPopup(`
      <strong>Suspicious Login</strong><br>
      Location: ${log.location}<br>
      Source: ${log.requestType}<br>
      User Response: ${log.userResponse}<br>
      Result: ${log.result}
    `)
    .addTo(map);
  }
});
      viewer.innerHTML = "<h3>Logged Responses:</h3>";
      data.logs.forEach(log => {
        viewer.innerHTML += `
          <p>
            <strong>Type:</strong> ${log.requestType} <br>
            <strong>User:</strong> ${log.userResponse} <br>
            <strong>Result:</strong> ${log.result} <br>
            <strong>Time:</strong> ${new Date(log.timestamp).toLocaleString()}
          </p><hr>
        `;
      });
    });
};

const demoScenarios = [
  { requestType: "attacker", userResponse: "yes" },
  { requestType: "attacker", userResponse: "no" },
  { requestType: "user", userResponse: "no" },
  { requestType: "user", userResponse: "yes" }
];

function runDemoSequence() {


  demoScenarios.forEach((scenario, index) => {
    setTimeout(() => {
      const randomLocation = ["Ghana", "Nigeria", "Russia", "Brazil"][Math.floor(Math.random() * 4)];

      fetch('/log-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scenario, demo: true, location: randomLocation })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Demo step:", data);
        const viewer = document.getElementById("logViewer");
        viewer.innerHTML += `
          <div style="border-left: 4px solid ${data.data.suspicious ? 'red' : 'green'}; padding-left: 10px; margin-bottom: 10px;">
            <p>
              <strong>Mode:</strong> ${data.data.demo ? "DEMO" : "LIVE"}<br>
              <strong>Type:</strong> ${data.data.requestType}<br>
              <strong>User:</strong> ${data.data.userResponse}<br>
              <strong>Location:</strong> ${data.data.location}<br>
              <strong>Suspicious:</strong> ${data.data.suspicious ? "🚨 YES" : "✅ NO"}<br>
              <strong>Result:</strong> ${data.data.result}<br>
              <strong>Time:</strong> ${new Date(data.data.timestamp).toLocaleString()}
            </p>
          </div><hr>
        `;
      });
    }, index * 1500);
  });
}


document.getElementById("clearLogsBtn").onclick = () => {
  fetch('/clear-logs', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => {
    console.log(data.message);
    document.getElementById("logViewer").innerHTML = "<p>🧹 Logs cleared.</p>";
    result.textContent = "🧼 Log memory reset.";
  });
};

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
}
