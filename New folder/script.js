//You can edit ALL of the code here
let allShows = [];
let allEpisodes = [];

// Display shows as cards
function displayShows(shows) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  for (let show of shows) {
    const card = document.createElement("div");
    card.classList.add("show-card");

    const title = document.createElement("h2");
    title.textContent = show.name;

    const img = document.createElement("img");
    img.src = show.image?.medium || "";
    img.alt = show.name;

    card.appendChild(title);
    card.appendChild(img);

    rootElem.appendChild(card);
  }
}

// Display episodes as cards
function displayEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; //clears previous content

  //if no results show message
  if (episodeList.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No episodes match your search.";
    message.classList.add("no-results");
    rootElem.appendChild(message);
    return;
  }

  for (let episode of episodeList) {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image?.medium || "";
    episodeImage.alt = `Image for ${episode.name} {Season ${episode.season}, Episode ${episode.number}}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary || "";
    episodeSummary.classList.add("summary");

    episodeDiv.appendChild(episodeTitle);
    episodeDiv.appendChild(episodeImage);
    episodeDiv.appendChild(episodeSummary);

    rootElem.appendChild(episodeDiv);
  }
  updateEpisodeCount(episodeList);
}

// Update episode count
function updateEpisodeCount(episodes) {
  const episodeCountElement = document.getElementById("episode-count");
  episodeCountElement.textContent = `Showing ${episodes.length} episode(s)`;
}

// Format episodes for dropdown
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

function populateShows(shows) {
  const showSelect = document.getElementById("showSelect");
  showSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Shows";
  showSelect.appendChild(defaultOption);

  shows
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });
}

// Populate episode dropdown
function populateEpisodes(episodes) {
  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All episodes";
  defaultOption.selected = true;
  episodeSelect.appendChild(defaultOption);

  for (let episode of episodes) {
    const option = document.createElement("option");
    option.value = formatEpisodeCode(episode.season, episode.number);
    option.textContent = `${episode.name} (${option.value})`;
    episodeSelect.appendChild(option);
  }
}

// Load shows from API
async function loadShows() {
  const response = await fetch("https://api.tvmaze.com/shows");
  const data = await response.json();
  allShows = data;

  populateShows(allShows);
  displayShows(allShows);
}

// Load episodes for a show

async function loadEpisodes(showId) {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`,
  );
  const data = await response.json();
  allEpisodes = data;

  populateEpisodes(allEpisodes);
  displayEpisodes(allEpisodes);
}

// Search shows by title
function searchShows() {
  const term = document.getElementById("showSearchInput").value.toLowerCase();
  const filteredShows = allShows.filter((show) =>
    show.name.toLowerCase().includes(term),
  );
  displayShows(filteredShows);
}

// Search episodes by name/summary
function searchEpisodes() {
  const term = document
    .getElementById("episodeSearchInput")
    .value.toLowerCase();

  if (allEpisodes.length === 0) {
    document.getElementById("root").innerHTML =
      "<p>Please select a show first.</p>";
    updateEpisodeCount([]);
    return;
  }

  let filtered = allEpisodes;

  if (term !== "") {
    filtered = allEpisodes.filter((ep) => {
      const name = (ep.name || "").toLowerCase();
      const summary = (ep.summary || "").replace(/<[^>]*>/g, "").toLowerCase();
      return name.includes(term) || summary.includes(term);
    });
  }

  displayEpisodes(filtered);
}

// Clear filters function
function clearFilters() {
  document.getElementById("episodeSearchInput").value = "";
  document.getElementById("showSearchInput").value = "";
  document.getElementById("showSelect").value = "all";
  allEpisodes = [];

  // Reset episodes dropdown
  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select a show to view episodes";
  episodeSelect.appendChild(defaultOption);

  // Display all shows
  displayShows(allShows);

  //update episode count to 0
  updateEpisodeCount([]);

  //clear filter messages
  document.getElementById("activeFilters").textContent = "";
  document.getElementById("helperMessage").textContent = "";
}

// Event listeners

window.addEventListener("DOMContentLoaded", () => {
  loadShows(); // populate shows first

  // Show dropdown
  document.getElementById("showSelect").addEventListener("change", (e) => {
    if (e.target.value !== "all") loadEpisodes(e.target.value);
  });

  // Episode dropdown
  document.getElementById("episodeSelect").addEventListener("change", (e) => {
    const selectedCode = e.target.value;
    if (selectedCode === "all") {
      displayEpisodes(allEpisodes);
    } else {
      const filtered = allEpisodes.filter(
        (ep) => formatEpisodeCode(ep.season, ep.number) === selectedCode,
      );
      displayEpisodes(filtered);
    }
    document.getElementById("episodeSearchInput").value = "";
  });

  // Search buttons
  document
    .getElementById("searchShowsButton")
    .addEventListener("click", searchShows);
  document
    .getElementById("searchEpisodesButton")
    .addEventListener("click", searchEpisodes);

  //Clear filters
  document
    .getElementById("clearFilters")
    .addEventListener("click", clearFilters);
});
