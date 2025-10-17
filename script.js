let currentQuestion = 0;

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

function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const gesture = classifyGesture(landmarks);
    showGestureIcon(gesture);
    checkAnswer(gesture);
  }
}

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

const videoElement = document.getElementById('webcam');
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 320,
  height: 240
});

camera.start();
showQuestion();
