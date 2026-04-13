//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (let episode of episodeList) {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    episodeDiv.appendChild(episodeTitle);

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeDiv.appendChild(episodeImage);

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;
    episodeSummary.classList.add("summary");
    episodeDiv.appendChild(episodeSummary);

    rootElem.appendChild(episodeDiv);
  }
}
window.onload = setup;
