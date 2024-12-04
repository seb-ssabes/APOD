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
    resultsContainer.innerHTML = data.map(
      (item) => `
      <div class="search-result">
        <h3>${item.title}</h3>
        <p>${item.explanation}</p>
        <p><small>${item.date}</small></p>
      </div>`
    ).join("");
  }
}
