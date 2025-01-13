class Sprite {
  constructor(config) {
    // Set up image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow || false;

    if (this.useShadow) {
      this.shadow.src = "./images/characters/shadow.png";
    }

    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // capture the movement frames
    // define all the standing animations walk left, walk right etc
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };

    // key from the animations above
    this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
    // which animations to display
    this.currentAnimationFrame = 0;

    // How many game loop frames we want to show one cut of the sprite sheet
    this.animationFrameLimit = config.animationFrameLimit || 8;

    // how much time is left to switch to next frame
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference to game object (thing that created the sprite)
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  // key is 'idle-down' 'walk-down' etc
  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;

      // reset frame for new animation
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // downtick any frame we are on before we switch
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, camera) {
    // nums inside withGrid are relative to the game grid
    const x = this.gameObject.x - 8 + utils.withGrid(10.5) - camera.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - camera.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);

    this.updateAnimationProgress();
  }
}
