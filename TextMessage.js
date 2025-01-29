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
            <p class="textMessage_p"></p>
            <button class="textMessage_button">Next</button>
        `;

    // init typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".textMessage_p"),
      text: this.text,
    });

    this.element.querySelector("button").addEventListener("click", () => {
      // close the text
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      // remove element
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
