import { Controller } from "@hotwired/stimulus"
import Typed from 'typed.js';

export default class extends Controller {
  static values = { strings: Array };

  connect() {
    this.element.textContent = "";

    if (this.element.dataset.typedInitialized === "true") {
      return;
    }

    this.typed = new Typed(this.element, {
      strings: this.stringsValue,
      typeSpeed: 5,
      backSpeed: 0,
      loop: false,
      showCursor: false,
    });

    this.element.dataset.typedInitialized = "true";
  }
}
