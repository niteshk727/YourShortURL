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
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const container = document.querySelector(".container"); // Select the container

  if (!url) {
    showError("Please enter a URL.", 0);
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

  // Add your logo image path here (e.g., favicon or logo)
  const logoUrl = "favicon_io/apple-touch-icon.png"; // or "favicon_io/apple-touch-icon.png" or your logo path
  const dotColor = getRandomDarkColor(); // Define the dot color here
  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: "canvas",
    data: url,
    image: logoUrl, // <-- This adds the image to the center
    dotsOptions: {
      color: dotColor, // Yes, you can call it directly here if it's in scope
      type: "rounded",
      gradient: {
        type: "radial",
        rotation: 0,
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
      margin: 10, // space around the image
      imageSize: 0.25 // 25% of QR size; adjust as needed
    },
    cornerSquareOptions: {
      color: dotColor,
      type: "extra-rounded"
    },
    cornerDotOptions: {
      color: dotColor,
      type: "extra-rounded"
    },
    // qrOptions: {
    //   typeNumber: 0,
    //   mode: "Byte",
    //   errorCorrectionLevel: "H"
    // }
  });

  qrCode.append(qrContainer);
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

// Call the function on page load
setRandomBackground();
generateIcons();