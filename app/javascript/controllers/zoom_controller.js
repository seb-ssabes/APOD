import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['modal', 'zoomedImage', 'image']

  open(e) {
    e.preventDefault();
    
    this.modalTarget.classList.remove("hidden");
    this.modalTarget.classList.add("flex");

    // if (this.hasImageTarget) {
    //   const src = this.imageTarget.getAttribute("src");
    //   this.zoomedImageTarget.setAttribute("src", src)
    // }
  }

  close(e) {
    if (e.target === this.ModalTarget) {
      this.modalTarget.classList.add("hidden");
      this.modalTarget.classList.remove("flex")
    }
  }
}
