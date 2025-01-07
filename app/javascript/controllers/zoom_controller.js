import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['modal', 'zoomedImage', 'image', 'infoModal']

  open(e) {
    e.preventDefault();

    this.modalTarget.classList.remove("hidden");
    this.modalTarget.classList.add("flex");

    if (this.hasImageTarget) {
      const src = this.imageTarget.getAttribute("src");
      this.zoomedImageTarget.setAttribute("src", src)
    }
  }

  close(e) {
    if (e.target === this.ModalTarget || e.target.dataset.action === "click->zoom#close") {
      this.modalTarget.classList.add("hidden");
      this.modalTarget.classList.remove("flex")
    }
  }

  infoOpen(e) {
    e.preventDefault();

    this.infoModalTarget.classList.remove("hidden");
    this.infoModalTarget.classList.add("flex");
  }

  infoClose(e) {
    if (e.target === this.infoModalTarget || e.target.dataset.action === "click->zoom#infoClose") {
      this.infoModalTarget.classList.add("hidden");
      this.infoModalTarget.classList.remove("flex")
    }
  }
}
