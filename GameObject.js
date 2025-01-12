class GameObject {
  constructor(config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this, // allow gameObject to have access to x and y properites from above
      src: config.src || "./images/characters/people/hero.png", // the sprite image that should be used
      useShadow: config.useShadow,
    });
  }

  update() {}
}
