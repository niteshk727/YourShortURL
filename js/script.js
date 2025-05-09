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
  // Generate random dark colors
  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      const randomValue = Math.floor(Math.random() * 16);
      // Ensure the color is dark by limiting brightness (0-8 range for darker shades)
      color += letters[randomValue < 8 ? randomValue : randomValue - 8];
    }
    return color;
  };

  // Generate three random dark colors for the gradient
  const color1 = getRandomDarkColor();
  const color2 = getRandomDarkColor();
  const color3 = getRandomDarkColor();

  // Apply the gradient to the body
  document.body.style.background = `linear-gradient(45deg, ${color1}, ${color2}, ${color3})`;
  document.body.style.backgroundSize = "300% 300%"; // Larger size for smoother animation
  document.body.style.animation = "gradientAnimation 20s ease infinite"; // Smooth gradient animation
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