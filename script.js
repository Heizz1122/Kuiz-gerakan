let currentQuestion = 0;
const videoElement = document.getElementById('webcam');

// 1️⃣ Papar soalan
function showQuestion() {
  const q = quiz[currentQuestion];
  if (!q) {
    document.getElementById("question-text").textContent = "❌ Soalan tak dijumpai.";
    return;
  }

  document.getElementById("question-text").textContent = q.question;
  const list = document.getElementById("options-list");
  list.innerHTML = "";

  const gestureIcons = ["✋", "✌️", "☝️", "🤟"];
  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.textContent = `${gestureIcons[i]} ${opt}`;
    list.appendChild(li);
  });
}

// 2️⃣ Semak jawapan
function checkAnswer(gestureIndex) {
  const correct = quiz[currentQuestion].answer;
  const feedback = document.getElementById("feedback");
  if (gestureIndex === correct) {
    feedback.textContent = "✅ Betul!";
    currentQuestion++;
    if (currentQuestion < quiz.length) {
      setTimeout(() => {
        feedback.textContent = "";
        showQuestion();
      }, 1000);
    } else {
      feedback.textContent = "🎉 Tamat kuiz!";
    }
  } else {
    feedback.textContent = "❌ Salah, cuba lagi!";
  }
}

// 3️⃣ Bila gesture dikesan
function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const gesture = classifyGesture(landmarks);
    showGestureIcon(gesture);
    checkAnswer(gesture);
  }
}

// 4️⃣ Setup MediaPipe Hands
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});
hands.onResults(onResults);

// 5️⃣ Setup kamera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    });
    videoElement.srcObject = stream;

    videoElement.onloadeddata = () => {
      const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  }
});
      camera.start();
    };
  } catch (err) {
    alert("❌ Tak dapat akses kamera. Sila benarkan permission.");
    console.error("Camera error:", err);
  }
}

// 6️⃣ Auto-restart bila user kembali ke tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    startCamera();
  }
});

// 7️⃣ Mula app
startCamera();
showQuestion();
