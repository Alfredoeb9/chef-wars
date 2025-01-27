class Person extends GameObject {
  constructor(config) {
    super(config);
    // add values specific movement
    this.movingProgressRemaining = 0;

    // make sure the player is the only one playable
    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // Keyboard ready and detect when a arrow is coming in
      if (this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    // set character direction to what behavior has
    this.direction = behavior.direction;

    // fire off direction without keys being pressed
    if (behavior.type === "walk") {
      // stop character from hitting object if not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      // ready to walk
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
  }

  // update the sprite cut / direction they are looking
  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }

    this.sprite.setAnimation("idle-" + this.direction);
  }
}
