function shortenURL() {
  const url = document.getElementById("urlInput").value.trim();
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const container = document.querySelector(".container"); // Select the container

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

  // Show the spinner
  loadingSpinner.classList.remove("d-none");

  // Use TinyURL API
  fetch(`https://api.tinyurl.com/create`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer iG0gkLmiP0npXJADQ8C80kjbmBegQKE2ZHRj7WT8yLYVIG4EMlXVGNqD6z39", // Replace with your TinyURL API key
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  })
  .then(res => res.json())
  .then(data => {
    if (data.data && data.data.tiny_url) {
      shortUrlInput.value = data.data.tiny_url;
      resultDiv.classList.remove("d-none");
      generateQR(data.data.tiny_url);

      // Move the container up
      container.classList.add("moved-up");
    } else {
      alert("Uh-Oh! Error shortening Your URL");
    }
  })
  .catch(() => {
    alert("Something went wrong. Try again.");
  })
  .finally(() => {
    // Hide the spinner
    loadingSpinner.classList.add("d-none");
  });
}

function copyURL() {
  const shortUrlInput = document.getElementById("shortUrl");
  shortUrlInput.select();
  document.execCommand("copy");
  alert("Short URL copied!");
}

function generateQR(url) {
  const qrContainer = document.getElementById("qrContainer");
  const qrCard = document.getElementById("qrCard");

  // Clear previous QR code
  qrContainer.innerHTML = "";

  // Create a new QR code with default black and white colors
  new QRCode(qrContainer, {
    text: url,
    width: 200, // Default size
    height: 200,
    colorDark: "#000000", // Black
    colorLight: "#ffffff" // White
  });

  // Show the flip card
  qrCard.classList.remove("d-none");
}

function setRandomBackground() {
  const colors = [
    "#ff9a9e", "#fad0c4", "#fbc2eb", "#a18cd1", "#fbc2eb", "#fad0c4", "#ff9a9e"
  ];
  const randomColors = colors.sort(() => Math.random() - 0.5).slice(0, 3);
  document.body.style.background = `linear-gradient(45deg, ${randomColors.join(", ")})`;
  document.body.style.backgroundSize = "300% 300%";
  document.body.style.animation = "gradientAnimation 10s ease infinite";
}

function generateIcons() {
  const iconBackground = document.getElementById("iconBackground");
  const icons = [
    "🔗", "🌐", "✨", "🚀", "📎", "🔒", "💡", "📱", "💻", "📧", "📂", "📊", "📈", "📉", "🔍", "🖱️", "🖥️", "📷", "🎥", "🎨", "📡", "📞", "📺", "🎵", "🎶", "🎧"
  ]; // Expanded list of glyphicons
  for (let i = 0; i < 40; i++) { // Increased the number of icons
    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
    icon.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    icon.style.animationDuration = `${5 + Math.random() * 5}s`; // Random animation duration
    icon.style.fontSize = `${1 + Math.random() * 2}rem`; // Random font size
    iconBackground.appendChild(icon);
  }
}

// Call the function on page load
setRandomBackground();
generateIcons();
