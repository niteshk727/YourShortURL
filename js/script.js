function shortenURL() {
  const url = document.getElementById("urlInput").value.trim();
  const customAlias = document.getElementById("customAlias").value.trim();
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const container = document.querySelector(".container");

  if (!url) {
    showError("Please enter a URL.");
    return;
  }

  // Show the spinner
  loadingSpinner.classList.remove("d-none");

  // Prepare the request body
  const requestBody = { url };
  if (customAlias) {
    requestBody.alias = customAlias; // Add alias if provided
  }

  // Use TinyURL API
  fetch(`https://api.tinyurl.com/create`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer iG0gkLmiP0npXJADQ8C80kjbmBegQKE2ZHRj7WT8yLYVIG4EMlXVGNqD6z39", // Replace with your TinyURL API key
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.data && data.data.tiny_url) {
        shortUrlInput.value = data.data.tiny_url;
        resultDiv.classList.remove("d-none");
        generateQR(data.data.tiny_url);

        // Move the container up
        container.classList.add("moved-up");
      } else {
        showError("Failed to shorten the URL. Please try again.");
      }
    })
    .catch(() => {
      showError("Something went wrong. Try again.");
    })
    .finally(() => {
      // Hide the spinner
      loadingSpinner.classList.add("d-none");
    });
}

function copyURL() {
  const shortUrlInput = document.getElementById("shortUrl");

  // Check if the Clipboard API is supported
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shortUrlInput.value)
      .then(() => {
        showMessage("Short URL copied successfully!");
      })
      .catch((err) => {
        showError("Failed to copy the URL. Please try again.");
        console.error("Clipboard error:", err);
      });
  } else {
    // Fallback for unsupported browsers
    shortUrlInput.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showMessage("Short URL copied successfully!");
      } else {
        showError("Failed to copy the URL. Please try again.");
      }
    } catch (err) {
      showError("Failed to copy the URL. Please try again.");
      console.error("Fallback copy error:", err);
    }
  }
}

function generateQR(url) {
  const qrContainer = document.getElementById("qrContainer");
  const qrCard = document.getElementById("qrCard");
  const downloadIcon = document.getElementById("downloadQR");
  const qrSubtitle = document.getElementById("qrSubtitle");

  // Clear previous QR code
  qrContainer.innerHTML = "";

  // Create a new QR code
  new QRCode(qrContainer, {
    text: url,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

  // Show the flip card
  qrCard.classList.remove("d-none");

  // Show the download icon
  downloadIcon.classList.remove("d-none");

  // Set the subtitle to the shortened URL
  qrSubtitle.textContent = url;
}

// Download QR code as PNG with subtitle
document.getElementById("downloadQR").addEventListener("click", function () {
  const qrCanvas = document.querySelector("#qrContainer canvas");
  const url = document.getElementById("qrSubtitle").textContent;

  // Create a new canvas to combine QR and subtitle
  const combinedCanvas = document.createElement("canvas");
  const width = 220, height = 260;
  combinedCanvas.width = width;
  combinedCanvas.height = height;
  const ctx = combinedCanvas.getContext("2d");

  // Draw QR code
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(qrCanvas, 10, 10, 200, 200);

  // Draw subtitle
  ctx.font = "14px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText(url, width / 2, 235, 200);

  // Download
  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = combinedCanvas.toDataURL("image/png");
  link.click();
});

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
  iconBackground.innerHTML = ""; // Clear previous icons

  const icons = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "🥴", "😠", "😡", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓"
  ];

  const ICON_COUNT = 40;

  function spawnIcon() {
    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
    icon.style.left = `${Math.random() * 100}vw`;
    icon.style.fontSize = `${1 + Math.random() * 2}rem`;
    const duration = 5 + Math.random() * 7; // 5-12 seconds
    icon.style.animationDuration = `${duration}s`;

    // When animation ends, respawn the icon
    icon.addEventListener('animationend', function () {
      icon.remove();
      spawnIcon();
    });

    iconBackground.appendChild(icon);
  }

  for (let i = 0; i < ICON_COUNT; i++) {
    setTimeout(spawnIcon, Math.random() * 5000); // Stagger initial spawn
  }
}

function pasteFromClipboard() {
  navigator.clipboard.readText()
    .then(text => {
      document.getElementById("urlInput").value = text;
    })
    .catch(() => {
      showError("Unable to read clipboard. Try pasting manually!");
    });
}

function redirectURL() {
  let shortUrl = document.getElementById("shortUrl").value.trim();
  if (shortUrl && !/^https?:\/\//i.test(shortUrl)) {
    shortUrl = "https://" + shortUrl;
  }
  if (shortUrl) window.open(shortUrl, "_blank");
}

// Toggle flip card on click
function toggleFlipCard() {
  const flipCardInner = document.querySelector(".flip-card-inner");
  flipCardInner.classList.toggle("flipped");

  // Show the download button only when flipped
  const downloadButton = document.getElementById("downloadQR");
  if (flipCardInner.classList.contains("flipped")) {
    downloadButton.classList.remove("d-none");
  } else {
    downloadButton.classList.add("d-none");
  }
}

function toggleCustomAlias() {
  const customAliasInputContainer = document.getElementById("customAliasInputContainer");
  const customAliasCheckbox = document.getElementById("customAliasCheckbox");

  if (customAliasCheckbox.checked) {
    customAliasInputContainer.classList.remove("d-none");
  } else {
    customAliasInputContainer.classList.add("d-none");
  }
}

function showMessage(message) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");

  modalTitle.textContent = "Message";
  modalTitle.className = "modal-title text-success";
  modalMessage.textContent = message;
  modalIcon.className = "bi bi-check-circle text-success fs-1";

  const modal = new bootstrap.Modal(document.getElementById("messageModal"));
  modal.show();

  // Automatically hide the modal after 1.5 seconds
  setTimeout(() => modal.hide(), 1500);
}

function showError(error) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");

  modalTitle.textContent = "Error";
  modalTitle.className = "modal-title text-danger";
  modalMessage.textContent = error;
  modalIcon.className = "bi bi-x-circle text-danger fs-1";

  const modal = new bootstrap.Modal(document.getElementById("messageModal"));
  modal.show();

  // Automatically hide the modal after 3 seconds
  // setTimeout(() => modal.hide(), 3000);
}

// Call the function on page load
setRandomBackground();
generateIcons();
// animateTextTransition();

// Initialize Bootstrap tooltips
document.addEventListener("DOMContentLoaded", () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Test messages
// showMessage("This is a test success message!");
// showError("This is a test error message!");

