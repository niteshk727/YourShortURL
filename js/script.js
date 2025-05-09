function shortenURL() {
  const url = document.getElementById("urlInput").value.trim();
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

  // Use CleanURI API
  fetch(`https://cleanuri.com/api/v1/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `url=${encodeURIComponent(url)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.result_url) {
      shortUrlInput.value = data.result_url;
      resultDiv.classList.remove("d-none");
      generateQR(data.result_url);
    } else {
      alert("Error shortening URL.");
    }
  })
  .catch(() => {
    alert("Something went wrong. Try again.");
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
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: url,
    width: 150,
    height: 150
  });
}
