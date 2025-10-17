function showGestureIcon(gestureIndex) {
  const icons = ["✋", "✌️", "☝️", "🤟"];
  const container = document.getElementById("gesture-icon");

  if (gestureIndex >= 0 && gestureIndex < icons.length) {
    container.textContent = icons[gestureIndex];
    container.style.opacity = 1;
    container.style.transform = "scale(1.2)";
    setTimeout(() => {
      container.style.opacity = 0;
      container.style.transform = "scale(1)";
    }, 1000);
  }
}
