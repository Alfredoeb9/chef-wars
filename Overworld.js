class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // reset the canvas each loop
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //Draw Lower layer
      this.map.drawLowerImage(this.ctx);

      // in between Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
        });
        object.sprite.draw(this.ctx);
      });

      // Draw Upper Layer
      this.map.drawUpperImage(this.ctx);
      requestAnimationFrame(() => {
        step();
      });
    };

    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);

    // grab input bindings to document "down, right, left, up"
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
