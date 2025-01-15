import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['zoomModal', 'zoomedImage', 'image', 'infoModal', 'childModal', 'childZoomModal']

  open(e) {
    e.preventDefault();

    this.zoomModalTarget.classList.remove("hidden");
    this.zoomModalTarget.classList.add("flex");

    requestAnimationFrame(() => {
      this.zoomModalTarget.classList.add("zoom-modal-effect");
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.childZoomModalTarget.classList.add("zoom-modal-effect");
      });
    }, 800);

    if (this.hasImageTarget) {
      const src = this.imageTarget.getAttribute("src");
      this.zoomedImageTarget.setAttribute("src", src);
    }
  }

  close(e) {
    if (e.target === this.zoomModalTarget || e.target.dataset.action === "click->zoom#close") {
      this.childZoomModalTarget.classList.remove("zoom-modal-effect");
    }

    this.zoomModalTarget.classList.remove("zoom-modal-effect");

    setTimeout(() => {
      this.zoomModalTarget.classList.add("hidden");
    }, 1000);
  }

  infoOpen(e) {
    e.preventDefault();

    this.infoModalTarget.classList.remove("hidden");
    this.infoModalTarget.classList.add("flex");

    requestAnimationFrame(() => {
      this.infoModalTarget.classList.add("info-modal-effect");
    })

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.childModalTarget.classList.add("info-modal-effect");
      });
    }, 800);
  }

  infoClose(e) {
    if (e.target === this.infoModalTarget || e.target.dataset.action === "click->zoom#infoClose") {
      this.childModalTarget.classList.remove("info-modal-effect");

      this.infoModalTarget.classList.remove("info-modal-effect");

      setTimeout(() => {
        this.infoModalTarget.classList.add("hidden");
      }, 1000);
    }
  }
}
