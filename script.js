let currentQuestion = 0;
let model;

async function setup() {
  const video = document.getElementById("webcam");
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  tf.setBackend('webgl');
  await tf.ready();

  model = await handpose.load();
  detectGesture();
  showQuestion();
}

function showQuestion() {
  console.log("Current question:", quiz[currentQuestion]);
  const q = quiz[currentQuestion];
  if (!q) {
    document.getElementById("question-text").textContent = "❌ Soalan tak dijumpai.";
    return;
  }
  document.getElementById("question-text").textContent = q.question;
  const list = document.getElementById("options-list");
  list.innerHTML = "";
  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    list.appendChild(li);
  });
}

async function detectGesture() {
  const video = document.getElementById("webcam");
  const predictions = await model.estimateHands(video);
  if (predictions.length > 0) {
    const gesture = classifyGesture(predictions[0].landmarks);
    checkAnswer(gesture);
  }
  requestAnimationFrame(detectGesture);
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

setup();
