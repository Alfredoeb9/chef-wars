class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {}; // keep track of all the walls

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc; // tiles or floow

    this.upperImage = new Image();
    this.upperImage.Src = config.upperSrc; // roottops or tree tops on top of the players head

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, camera) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - camera.x,
      utils.withGrid(6) - camera.y
    );
  }

  drawUpperImage(ctx, camera) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - camera.x,
      utils.withGrid(6) - camera.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);

    return this.walls[`${x}, ${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;
      // TODO: determin if this object should mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
  }

  addWall(x, y) {
    this.walls[`${x}, ${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x}, ${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "./images/maps/DemoLower.png",
    upperSrc: "./images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5), // withGrid multiples this by the tiles size (16)
        y: utils.withGrid(6),
      }),
      npc1: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "up", time: 300 },
        ],
      }),
      npc2: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        src: "./images/characters/people/npc2.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "up", time: 800 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
        ],
      }),
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
  },
  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(5),
      }),
      npc1: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: "./images/characters/people/npc1.png",
      }),
      npc2: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "./images/characters/people/npc2.png",
      }),
    },
  },
};
