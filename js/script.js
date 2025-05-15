let lastShortUrl = ""; // Add this at the top of your script.js

// Utility: Generate a random dark color
function getRandomDarkColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    const randomValue = Math.floor(Math.random() * 16);
    // Ensure the color is dark by limiting brightness (0-8 range for darker shades)
    color += letters[randomValue < 8 ? randomValue : randomValue - 8];
  }
  return color;
}

function setRandomBackground() {
  // Generate three random dark colors for the gradient
  const color1 = getRandomDarkColor();
  const color2 = getRandomDarkColor();
  const color3 = getRandomDarkColor();

  // Apply the gradient to the body
  document.body.style.background = `linear-gradient(45deg, ${color1}, ${color2}, ${color3})`;
  document.body.style.backgroundSize = "300% 300%";
  document.body.style.animation = "gradientAnimation 20s ease infinite";
}

function shortenURL() {
  const url = document.getElementById("urlInput").value.trim();
  const customAlias = document.getElementById("customAlias").value.trim();
  const customAliasCheckbox = document.getElementById("customAliasCheckbox");
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const container = document.querySelector(".container"); // Select the container

  if (!url) {
    showError("Please enter a URL.", 0);
    return;
  }

  // Check if custom alias checkbox is checked but no alias provided
  if (customAliasCheckbox && customAliasCheckbox.checked && !customAlias) {
    showError("Please provide a custom alias.", 0);
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
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
        showError("Uh-Oh! Error shortening Your URL", 2000);
      }
    })
    .catch(() => {
      showError("Something went wrong. Try again.", 1500);
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
        showMessage("Short URL copied successfully!", 1500);
      })
      .catch((err) => {
        showError("Failed to copy the URL. Please try again.", 2000);
        console.error("Clipboard error:", err);
      });
  } else {
    // Fallback for unsupported browsers
    shortUrlInput.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showMessage("Short URL copied successfully!", 1500);
      } else {
        showError("Failed to copy the URL. Please try again.", 2000);
      }
    } catch (err) {
      showError("Failed to copy the URL. Please try again.", 2000);
      console.error("Fallback copy error:", err);
    }
  }
}

function generateQR(url) {
  const qrContainer = document.getElementById("qrContainer");
  const qrCard = document.getElementById("qrCard");
  const downloadBtn = document.getElementById("downloadQRBtn");

  // Clear previous QR code
  qrContainer.innerHTML = "";

  // Show the card before rendering QR
  qrCard.classList.remove("d-none");

  // Responsive size: 90% of card or max 300px
  let size = Math.min(
    Math.floor(window.innerWidth * 0.7),
    300
  );
  if (window.innerWidth < 480) size = Math.min(window.innerWidth * 0.85, 220);

  const logoUrl = "favicon_io/apple-touch-icon.png";
  const dotColor = getRandomDarkColor();

  function renderQRCode(withLogo) {
    const qrOptions = {
      width: size,
      height: size,
      type: "canvas",
      data: url,
      dotsOptions: {
        color: dotColor,
        type: "rounded",
        gradient: {
          type: "radial",
          rotation: Math.PI / 5,
          colorStops: [
            { offset: 0, color: dotColor },
            { offset: 1, color: dotColor }
          ]
        }
      },
      backgroundOptions: {
        color: "#ffffff"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
        imageSize: 0.20
      },
      cornerSquareOptions: {
        color: dotColor,
        type: "dot"
      },
      cornerDotOptions: {
        color: dotColor,
        type: "dot"
      }
    };
    if (withLogo) {
      qrOptions.image = logoUrl;
    }
    const qrCode = new QRCodeStyling(qrOptions);
    qrCode.append(qrContainer);

    // Show the download button
    if (downloadBtn) downloadBtn.style.display = "inline-block";

    // Store the last short URL for filename
    lastShortUrl = url;
    // Save qrCode instance for download
    downloadBtn.qrCodeInstance = qrCode;
  }

  // Try to load the logo image first
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    renderQRCode(true);
  };
  img.onerror = function () {
    renderQRCode(false);
  };
  img.src = logoUrl;
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
      showError("Unable to read clipboard. Try pasting manually");
    });
}

function redirectURL() {
  let shortUrl = document.getElementById("shortUrl").value.trim();
  if (shortUrl && !/^https?:\/\//i.test(shortUrl)) {
    shortUrl = "https://" + shortUrl;
  }
  if (shortUrl) window.open(shortUrl, "_blank");
}

function showMessage(message, timeInSeconds) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");

  // Update modal content
  modalTitle.textContent = "Message";
  modalTitle.className = "modal-title text-success"; // Green title
  modalMessage.textContent = message; // Set the message content
  modalIcon.className = "bi bi-check-circle text-success fs-1"; // Green check icon

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("messageModal"));
  modal.show();
  if (timeInSeconds != 0) {
    setTimeout(() => {
      modal.hide();
    }, timeInSeconds);
  }
}

function showError(error, timeInSeconds) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");

  // Update modal content
  modalTitle.textContent = "Error";
  modalTitle.className = "modal-title text-danger"; // Red title
  modalMessage.textContent = error; // Set the error content
  modalIcon.className = "bi bi-x-circle text-danger fs-1"; // Red cross icon

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("messageModal"));
  modal.show();
  if (timeInSeconds != 0) {
    setTimeout(() => {
      modal.hide();
    }, timeInSeconds);
  }
}

// Enable tap/click to flip for all devices
document.addEventListener("DOMContentLoaded", function () {
  const qrCard = document.getElementById("qrCard");
  if (qrCard) {
    qrCard.addEventListener("click", function () {
      qrCard.classList.toggle("flipped");
    });
  }
});

// Initialize Bootstrap tooltips
document.addEventListener("DOMContentLoaded", () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

function toggleCustomAlias() {
  const customAliasInputContainer = document.getElementById("customAliasInputContainer");
  const customAliasCheckbox = document.getElementById("customAliasCheckbox");

  if (customAliasCheckbox.checked) {
    customAliasInputContainer.classList.remove("d-none");
  } else {
    customAliasInputContainer.classList.add("d-none");
  }
}

// Add event listener for download button
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadQRBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async function () {
      const qrCanvas = document.querySelector("#qrContainer canvas");
      if (!qrCanvas) return;

      // Set heights and border
      const brandHeight = 50; // Branding area at the top
      const urlHeight = 36;   // URL area at the bottom
      const borderSize = 5;   // Border thickness
      const padding = 20;     // Padding around QR code

      // Calculate final canvas size (equal padding on all sides)
      const width = qrCanvas.width + padding * 2;
      const height = qrCanvas.height + brandHeight + urlHeight + padding * 2;

      // Create final canvas
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = width;
      finalCanvas.height = height;
      const ctx = finalCanvas.getContext("2d");

      // Fill background white
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      // Draw branding text at the top, with padding
      ctx.fillStyle = "#222";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(
        "© YourShortURL By NK",
        width / 2,
        padding + 12
      );

      // Draw QR code in the center area with padding
      const qrX = padding;
      const qrY = brandHeight + padding;
      ctx.drawImage(
        qrCanvas,
        qrX,
        qrY,
        qrCanvas.width,
        qrCanvas.height
      );

      // Draw border rectangle for QR code
      ctx.save();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = borderSize;
      ctx.strokeRect(
        qrX - borderSize / 2,
        qrY - borderSize / 2,
        qrCanvas.width + borderSize,
        qrCanvas.height + borderSize
      );
      ctx.restore();

      // Draw the tinyurl at the bottom
      ctx.fillStyle = "#222";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      let urlText = lastShortUrl || "";
      ctx.fillText(urlText, width / 2, height - padding);

      // Get filename from lastShortUrl
      let filename = "qr.png";
      if (lastShortUrl) {
        const parts = lastShortUrl.split("/");
        filename = (parts[parts.length - 1] || "qr") + ".png";
      }

      // Download the image
      const link = document.createElement("a");
      link.href = finalCanvas.toDataURL("image/png");
      link.download = filename;
      link.click();
    });
  }
});

// Call the function on page load
setRandomBackground();
generateIcons();