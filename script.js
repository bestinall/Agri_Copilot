function goToFeatures() {
  window.location.href = "features.html";
}

function handleAsk() {
  var input = document.getElementById("questionInput");
  var response = document.getElementById("ai-response");

  var question = input.value.trim();
  if (!question) {
    response.textContent = "Please enter a question.";
    return;
  }

  var lowerQ = question.toLowerCase();

  if (lowerQ.indexOf("crop") !== -1 || lowerQ.indexOf("grow") !== -1) {
    response.textContent = "📊 Based on weather and market, try growing Millet or Wheat this season.";
  } else if (lowerQ.indexOf("water") !== -1) {
    response.textContent = "💧 Drip irrigation can help save up to 40% of water usage.";
  } else {
    response.textContent = "🤖 Thanks! Your question will be forwarded to our AI Advisor.";
  }

  input.value = "";
}

function generatePlan() {
  var place = document.getElementById("place").value.trim();
  var goal = document.getElementById("goal").value;
  var resultDiv = document.getElementById("result");

  if (!place || !goal) {
    resultDiv.textContent = "⚠️ Please enter both place and goal.";
    return;
  }

  resultDiv.textContent = "⏳ Generating your crop plan...";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/get-plan", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        resultDiv.innerHTML = "<div class='plan-output'>" + renderResult(data) + "</div>";
      } else {
        resultDiv.innerHTML = "❌ Could not fetch the plan. Please check backend connection.";
      }
    }
  };

  var payload = JSON.stringify({ place: place, goal: goal });
  xhr.send(payload);
}

function renderResult(data) {
  var townhall = "";
  if (data.townhall && data.townhall.length > 0) {
    for (var i = 0; i < data.townhall.length; i++) {
      townhall += "- " + data.townhall[i].agent + ": " + data.townhall[i].message + "\n";
    }
  } else {
    townhall = "No messages";
  }

  var result =
    "📍 Location: " + data.place + "\n\n" +
    "🌦 Weather Summary:\n" + data.weather_summary + "\n\n" +
    "💰 Plan A – Profit Focused:\n" +
    "- Crop: " + (data.plan_a?.crop || "N/A") + "\n" +
    "- Yield: " + (data.plan_a?.yield || "N/A") + "\n" +
    "- Market Price: " + (data.plan_a?.market_price || "N/A") + "\n\n" +
    "🌱 Plan B – Sustainability Focused:\n" +
    "- Crop: " + (data.plan_b?.crop || "N/A") + "\n" +
    "- Water Need: " + (data.plan_b?.water_need || "N/A") + "\n" +
    "- Eco Score: " + (data.plan_b?.eco_score || "N/A") + "\n\n" +
    "🧠 AI Recommendation:\n" + (data.llm_reasoning || "No reasoning") + "\n\n" +
    "🤖 Agent Townhall:\n" + townhall;

  return result;
}
