class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 40;

    this.timeout = null;
    this.isDone = false;
  }

  revealingCharacter(list) {
    if (!Array.isArray(list)) {
      list = Array.from(list);
    }

    const next = list?.splice(0, 1)[0];
    next?.span?.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        // rerun list with new next character
        this.revealingCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;

    this.element.querySelectorAll("span").forEach((s) => {
      s.classList.add("revealed");
    });
  }

  init() {
    const characters = [];

    this.text.split("").forEach((character) => {
      let span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      });
    });

    console.log("char", characters);

    this.revealingCharacter(characters);
  }
}
