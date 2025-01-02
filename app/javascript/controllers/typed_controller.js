import { Controller } from "@hotwired/stimulus"
import Typed from 'typed.js';

export default class extends Controller {
  static values = { strings: Array };
  static targets = ['output'];

  connect() {
    // this.element.textContent = "";

    if (this.element.dataset.typedInitialized === "true") {
      return;
    }

    this.typed = new Typed(this.outputTarget, {
      strings: this.stringsValue,
      typeSpeed: 50,
      backSpeed: 0,
      loop: false,
      showCursor: false,
      startDelay: 2000,
    });

    this.element.dataset.typedInitialized = "true";
  }
}
