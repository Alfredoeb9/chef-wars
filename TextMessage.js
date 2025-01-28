class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  // create a div and presentation detail from scratch
  createElement() {
    // create the element
    this.element = document.createElement("div");
    this.element.classList.add("textMessage");

    this.element.innerHTML = `
            <p class="textMessage_p">${this.text}</p>
            <button class="textMessage_button">Next</button>
        `;

    this.element.querySelector("button").addEventListener("click", () => {
      // close the text
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      // remove element
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
