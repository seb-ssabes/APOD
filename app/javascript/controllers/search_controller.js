import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['input']

  submitSearch(event) {
    event.preventDefault();

    const query = this.inputTarget.value.trim().toLowerCase();
    if (query.length > 0) {
      fetch(`/search/api_search?query=${encodeURIComponent(query)}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      .then((response) => response.json())
      .then((data) => {
        this.updateResults(data)
      })
    }
  }

  updateResults(data) {
    const resultsContainer = document.querySelector("#search-results");
    resultsContainer.innerHTML = data.map((item) => {

      const truncatedExplanation = item.explanation ? item.explanation.split(" ").slice(0, 20).join(' ') + "..." : "";
      const youtubeIcon = `<i class="fa-brands fa-square-youtube text-red-400 text-3xl"></i>`
      const imageTag = `<img src="${item.url}" class="w-16 h-16 object-cover rounded-md">`
      const conditionalImage = item.url.includes("youtube") || item.url.includes("vimeo") ? youtubeIcon : imageTag;

      return `
        <div class="search-result flex flex-row items-center gap-4 border-b pb-2 mb-4 w-full">
          <div class="media flex-shrink-0">${conditionalImage}</div>
          <div class="text-start w-full flex flex-col">
            <h3 class="text-lg font-bold text-gray-800">${item.title}</h3>
            <p class="text-gray-500">${truncatedExplanation}</p>
            <p class="text-sm text-gray-400"><small>${item.date}</small></p>
          </div>
        </div>`
    }).join("");
  }
}
