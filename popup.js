let searchLocked = false;

document.addEventListener("DOMContentLoaded", function () {
  const inputEl = document.getElementById("searchInput");
  const buttonEl = document.getElementById("launchBtn");

  buttonEl.addEventListener("click", () => {
    if (!searchLocked) {
      launchSearch();
      lockSearch();
    }
  });

  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !searchLocked) {
      event.preventDefault();
      launchSearch();
      lockSearch();
    }
  });
});

function lockSearch() {
  searchLocked = true;
  setTimeout(() => {
    searchLocked = false;
  }, 3000);
}

function launchSearch() {
  const input = document.getElementById("searchInput").value.trim();
  if (!input) {
    alert("Enter a SIREN number or company name!");
    return;
  }

  const encoded = encodeURIComponent(input);
  const isSiren = /^\d{9,14}$/.test(input);

  let urls = [];

  if (isSiren) {
    urls = [
      `https://www.societe.com/cgi-bin/search?champs=${encoded}`,
      `https://www.google.com/search?q=site:infonet.fr+${encoded}`
    ];
  } else {
    urls = [
      `https://www.societe.com/cgi-bin/search?champs=${encoded}`,
      `https://www.pagesjaunes.fr/recherche/nom/${encoded}`,
      `https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22105015875%22%5D&geoUrn=%5B%22101314642%22%5D&keywords=${encoded}&origin=FACETED_SEARCH&lang=fr`,
      `https://www.google.com/search?q=${encoded}+site:infonet.fr`
    ];
  }

  let delay = 0;
  for (const url of urls) {
    setTimeout(() => {
      chrome.tabs.create({ url, active: false });
    }, delay);
    delay += 300;
  }
}
