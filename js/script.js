function shortenURL() {
  const url = document.getElementById("urlInput").value.trim();
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const qrContainer = document.getElementById("qrContainer");

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

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
