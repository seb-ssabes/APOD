import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['input', 'searchResults', 'pagination', 'totalMatches', 'dataContainer', 'spinner']

  connect() {
    this.cachedResults = [];
    this.currentQuery = "";
  }

  submitSearch(event, page = 1) {
    event.preventDefault();

    this.spinnerTarget.classList.remove('hidden')

    const query = this.inputTarget.value.trim().toLowerCase();
    if (query.length > 0) {
      if(query !== this.currentQuery) {
        fetch(`/search/api_search?query=${encodeURIComponent(query)}`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        })
        .then((response) => response.json())
        .then((data) => {
          this.cachedResults = data.filtered_results;
          this.totalMatches = data.total_matches;
          this.currentQuery = query;
          this.displayTotal(data.total_matches);

          const totalPages = Math.ceil(this.totalMatches / 5);
          this.updateResults(this.paginateResults(this.cachedResults, page));
          this.updatePagination(totalPages, page, query);

          console.log("Fetched filtered results:", data.filtered_results);
          console.log("Total matches:", data.total_matches);
          console.log("Current query:", this.currentQuery)
        });
      } else {
        const totalPages = data.total_matches > 0 ? Math.ceil(data.total_matches / 5) : 1;
        this.updateResults(this.paginateResults(this.cachedResults, page));
        this.updatePagination(totalPages, page, query)
      }
    }
  }

  paginateResults(results, page) {
    if(!results || results.length === 0) return [];

    const itemsPerPage = 5;
    const startIndex = (page - 1) * itemsPerPage;
    return results.slice(startIndex, startIndex + itemsPerPage)
  }

  updateResults(data, isNewSearch = true) {

    if (isNewSearch) {
      this.totalMatchesTarget.classList.remove("showup", "opacity-100");
      this.searchResultsTarget.classList.remove("showup", "opacity-100");
      this.paginationTarget.classList.remove("showup", "opacity-100");
    }

    setTimeout(() => { //re-trigger animations smoothly.
      this.searchResultsTarget.innerHTML = data.map((item) => {

        const truncatedExplanation = item.explanation ? item.explanation.split(" ").slice(0, 20).join(' ') + "..." : "";
        const youtubeIcon = `
        <div class="w-16 h-16 flex items-center justify-center rounded-md">
        <i class="fa-brands fa-square-youtube text-red-400" style="font-size: 4.5rem;"></i>
        </div>
        `;
      const imageTag = `<img src="${item.url}" class="w-16 h-16 object-cover rounded-md">`;
      const conditionalImage = item.url.includes("youtube") || item.url.includes("vimeo") ? youtubeIcon : imageTag;

      return `
        <div class="search-result flex flex-row items-center gap-4 border-b pb-2 mb-2 w-full">
        <div class="media flex-shrink-0">${conditionalImage}</div>
          <div class="text-start w-full flex flex-col">
            <h3 class="text-lg font-bold text-gray-700">
            <a href="/apod/${item.date}" class="hover:text-gray-500 hover:underline">${item.title}</a>
            </h3>
            <p class="text-gray-500">${truncatedExplanation}</p>
            <p class="text-sm text-gray-400"><small>${item.date}</small></p>
          </div>
          </div>`
      }).join("");

      this.spinnerTarget.classList.add('hidden');

      if (isNewSearch) {
        setTimeout(() => this.totalMatchesTarget.classList.add("showup"), 300);
        setTimeout(() => this.searchResultsTarget.classList.add("showup"), 800);
        setTimeout(() => this.paginationTarget.classList.add("showup"), 2000);
      }
    }, isNewSearch ? 100 : 0);

    console.log("API Response:", data);
    console.log("Total Matches:", data.totalMatches);
  }

  displayTotal(totalMatches) {
    this.totalMatchesTarget.textContent = `Total matches: ${totalMatches}`
  }

  updatePagination(totalPages, currentPage, query) {
    if(totalPages <= 1) {
      this.paginationTarget.innerHTML = "";
      return
    }

    const buttons = Array.from({length: totalPages}, (_, i) => {
      const page = i + 1;
      return `
        <button
          class="btn px-3 py-1 rounded ${page === currentPage ? 'bg-gray-500 text-white' : 'bg-gray-200'}"
          data-page="${page}"
          data-search-target="pageButton"
          data-query="${query}">
          ${page}
        </button>
      `
    }).join("");

    this.paginationTarget.innerHTML = buttons;

    const pageButtons = this.paginationTarget.querySelectorAll("button")

    pageButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const page = parseInt(e.target.dataset.page, 10);
        this.updateResults(this.paginateResults(this.cachedResults, page), false);
        this.updatePagination(totalPages, page, query);
      })
    })
  }
}
