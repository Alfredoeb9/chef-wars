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

      // Camera - this can help change the main camera (cut scences then change camera back to main character)
      const camera = this.map.gameObjects.hero;

      //update all objects - much larger maps/objects this needs to be optimized
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, camera);

      // in between Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          // reorder so lower y value is in the beginning nd higher is in the eng
          // for proper layering
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, camera);
        });

      // Draw Upper Layer
      this.map.drawUpperImage(this.ctx, camera);
      requestAnimationFrame(() => {
        step();
      });
    };

    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // ask if person is present to talk to
      this.map.checkForActionCutscene();
    });
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.bindActionInput();

    // grab input bindings to document "down, right, left, up"
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      // { who: "hero", type: "walk", direction: "down" },
      // { who: "hero", type: "walk", direction: "down" },
      // { who: "npc1", type: "walk", direction: "up" },
      // { who: "npc1", type: "walk", direction: "left" },
      // { who: "hero", type: "stand", direction: "right", time: 200 },
      // { type: "textMessage", text: "Why Hello There!" },
      // { who: "npc1", type: "walk", direction: "left" },
      // { who: "npc1", type: "stand", direction: "up", time: 800 },
    ]);
  }
}
