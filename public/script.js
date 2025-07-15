const scenarios = ["user", "attacker"];
const requestType = scenarios[Math.floor(Math.random() * scenarios.length)];
const scenarioText = document.getElementById("scenarioText");
const result = document.getElementById("result");

scenarioText.textContent = `Request triggered. Source: ${requestType === "user" ? "YOU" : "UNKNOWN"}. Did you request this code?`;

const demoToggle = document.getElementById("demoToggle");

function logResponse(userResponse) {
  const isDemo = demoToggle?.checked;
  const location = isDemo
    ? ["Ghana", "Nigeria", "Russia", "Brazil"][Math.floor(Math.random() * 4)]
    : "Ghana"; // Assume real users are in Ghana

  fetch('http://localhost:3000/log-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestType, userResponse, demo: isDemo, location })
  })
  .then(res => res.json())
  .then(data => {
    result.textContent = `[${isDemo ? "DEMO" : "LIVE"}] ${data.data.result}`;
    console.log("Logged:", data);
  });
}

document.getElementById("yesBtn").onclick = () => logResponse("yes");
document.getElementById("noBtn").onclick = () => logResponse("no");

document.getElementById("viewLogsBtn").onclick = () => {
  fetch('http://localhost:3000/get-logs')
    .then(res => res.json())
    .then(data => {
      const viewer = document.getElementById("logViewer");
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
      fetch('http://localhost:3000/log-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scenario, demo: true })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Demo step:", data);
        const viewer = document.getElementById("logViewer");
        viewer.innerHTML += `
  <div style="border-left: 4px solid ${log.suspicious ? 'red' : 'green'}; padding-left: 10px; margin-bottom: 10px;">
    <p>
      <strong>Mode:</strong> ${log.demo ? "DEMO" : "LIVE"}<br>
      <strong>Type:</strong> ${log.requestType}<br>
      <strong>User:</strong> ${log.userResponse}<br>
      <strong>Location:</strong> ${log.location}<br>
      <strong>Suspicious:</strong> ${log.suspicious ? "🚨 YES" : "✅ NO"}<br>
      <strong>Result:</strong> ${log.result}<br>
      <strong>Time:</strong> ${new Date(log.timestamp).toLocaleString()}
    </p>
  </div><hr>
`;
      });
    }, index * 1500); // 1.5s delay between each demo step
  });
}


document.getElementById("clearLogsBtn").onclick = () => {
  fetch('http://localhost:3000/clear-logs', {
    method: 'DELETE'
  })
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
