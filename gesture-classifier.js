function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return -1;

  const [thumbTip, indexTip, middleTip, ringTip, pinkyTip, wrist] = [
    landmarks[4],  // ibu jari
    landmarks[8],  // jari telunjuk
    landmarks[12], // jari tengah
    landmarks[16], // jari manis
    landmarks[20], // jari kelingking
    landmarks[0]   // pergelangan tangan
  ];

  // Kira jarak dari hujung jari ke pergelangan tangan
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  const thumbDist = dist(thumbTip, wrist);
  const indexDist = dist(indexTip, wrist);
  const middleDist = dist(middleTip, wrist);
  const ringDist = dist(ringTip, wrist);
  const pinkyDist = dist(pinkyTip, wrist);

  // Threshold untuk tentukan jari terbuka
  const threshold = 50;

  const fingers = [
    thumbDist > threshold,
    indexDist > threshold,
    middleDist > threshold,
    ringDist > threshold,
    pinkyDist > threshold
  ];

  // Mapping gesture → jawapan
  if (fingers.every(f => f)) return 0; // ✋ semua jari terbuka → A
  if (fingers[1] && fingers[2] && !fingers[3] && !fingers[4]) return 1; // ✌️ telunjuk + tengah → B
  if (fingers[1] && !fingers[2] && !fingers[3]) return 2; // ☝️ telunjuk je → C
  if (fingers[1] && fingers[4] && !fingers[2] && !fingers[3]) return 3; // 🤟 telunjuk + kelingking → D

  return -1; // Tak dikenali
}
