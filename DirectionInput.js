class DirectionInput {
  constructor() {
    // holding data in a array to know what keys were pressed
    // and the order they were pressed in
    this.heldDirections = [];

    // map that keycodes that we care about
    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right",
    };
  }

  //  enternal things what is being held
  get direction() {
    return this.heldDirections[0];
  }

  init() {
    // keep track of what is entering in array
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];

      // if key being held down is not in heldDirectiont then add to beginning
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    // keep track of what exits the array
    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];

      const index = this.heldDirections.indexOf(dir);

      if (index > -1) {
        // remove the entry at the index(start at "index", remove 1)
        this.heldDirections.splice(index, 1);
      }
    });
  }
}
