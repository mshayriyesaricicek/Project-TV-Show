//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  displayEpisodes(allEpisodes);
  populateEpisodes(allEpisodes);
  updateEpisodeCount(allEpisodes);

  const searchInput = document.getElementById("searchInput");
  const episodeSelect = document.getElementById("episodeSelect");
  const clearButton = document.getElementById("clearFilters");

  searchInput.addEventListener("input", () => {
    episodeSelect.value = "all"; // reset dropdown
    render();
  });

  episodeSelect.addEventListener("change", () => {
    searchInput.value = ""; // clear search
    render();
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    episodeSelect.value = "all";
    render();
  });
}

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
    //episodeDiv.appendChild(episodeTitle);

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = `Image for ${episode.name} {Season ${episode.season}, Episode ${episode.number}}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;
    episodeSummary.classList.add("summary");

    episodeDiv.appendChild(episodeTitle);
    episodeDiv.appendChild(episodeImage);
    episodeDiv.appendChild(episodeSummary);

    rootElem.appendChild(episodeDiv);
  }
}

function updateEpisodeCount(episodes) {
  const episodeCountElement = document.getElementById("episode-count");
  episodeCountElement.textContent = `Showing ${episodes.length} episode(s)`;
}

function render() {
  const searchInput = document.getElementById("searchInput");
  const episodeSelect = document.getElementById("episodeSelect");
  const clearButton = document.getElementById("clearFilters");
  const activeFiltersText = document.getElementById("activeFilters");
  const helperMessage = document.getElementById("helperMessage");

  const searchTerm = searchInput.value.toLowerCase();
  const selectedEpisode = episodeSelect.value;

  let filteredEpisodes = allEpisodes;

  // If dropdown is used → ignore search
  if (episodeSelect.value !== "all") {
    filteredEpisodes = allEpisodes.filter((episode) => {
      const episodeCode = formatEpisodeCode(episode.season, episode.number);
      return episodeCode === episodeSelect.value;
    });
  }
  // Else if search is used → ignore dropdown
  else if (searchTerm !== "") {
    filteredEpisodes = allEpisodes.filter((episode) => {
      const name = (episode.name || "").toLowerCase();
      const summary = (episode.summary || "")
        .replace(/<[^>]*>/g, "")
        .toLowerCase();

      return name.includes(searchTerm) || summary.includes(searchTerm);
    });
  }

  displayEpisodes(filteredEpisodes);
  updateEpisodeCount(filteredEpisodes);

  const hasSearch = searchInput.value !== "";
  const hasDropdown = episodeSelect.value !== "all";

  clearButton.style.display = "inline-block";

  if (hasSearch && hasDropdown) {
    activeFiltersText.textContent = `Filtering by: "${searchInput.value}" in ${episodeSelect.value}`;
  } else if (hasSearch) {
    activeFiltersText.textContent = `Filtering by: "${searchInput.value}"`;
  } else if (hasDropdown) {
    activeFiltersText.textContent = `Filtering by: ${episodeSelect.value}`;
  } else {
    activeFiltersText.textContent = "";
  }
  if (hasSearch || hasDropdown) {
    helperMessage.textContent =
      "Press 'Clear Filters' to reset your search and dropdown selections.";
  } else {
    helperMessage.textContent = "";
  }
}

async function loadEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  const data = await response.json();
  allEpisodes = data;
  setup();
}

loadEpisodes();

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}
function populateEpisodes(episodes) {
  const episodeSelect = document.getElementById("episodeSelect");

  episodeSelect.innerHTML = ""; // Clear existing options

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Episodes";
  episodeSelect.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(episode.season, episode.number);

    option.value = code;
    option.textContent = `${episode.name} (${code})`;

    episodeSelect.appendChild(option);
  });
}
