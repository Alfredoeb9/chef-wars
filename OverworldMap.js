class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
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

    // reset NPC to og behavior
    Object.values(this.gameObjects).forEach((object) => {
      object.doBehaviorEvent(this);
    });
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction); // check if anyone is in front of person object
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
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
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Why hello there!",
                faceHero: "npc1",
              },
              { type: "textMessage", text: "Welcome to the cafeteria!" },
              { who: "hero", type: "stand", direction: "up" },
            ],
          },
        ],
      }),
      npc2: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "./images/characters/people/npc2.png",
        // behaviorLoop: [
        //   { type: "walk", direction: "left" },
        //   { type: "stand", direction: "up", time: 800 },
        //   { type: "walk", direction: "up" },
        //   { type: "walk", direction: "right" },
        //   { type: "walk", direction: "down" },
        // ],
      }),
    },
    walls: {
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(1, 10)]: true,
      [utils.asGridCoord(2, 10)]: true,
      [utils.asGridCoord(3, 10)]: true,
      [utils.asGridCoord(4, 10)]: true,
      [utils.asGridCoord(6, 10)]: true,
      [utils.asGridCoord(7, 10)]: true,
      [utils.asGridCoord(8, 10)]: true,
      [utils.asGridCoord(9, 10)]: true,
      [utils.asGridCoord(10, 10)]: true,
      [utils.asGridCoord(11, 9)]: true,
      [utils.asGridCoord(11, 8)]: true,
      [utils.asGridCoord(11, 7)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(10, 3)]: true,
      [utils.asGridCoord(9, 3)]: true,
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: "npc2", type: "walk", direction: "left" },
            { who: "npc2", type: "stand", direction: "up", time: 500 },
            { type: "textMessage", text: "You can't be in there!" },
            { who: "npc2", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "left" },
          ],
        },
      ],

      [utils.asGridCoord(5, 10)]: [
        {
          events: [{ type: "changeMap", map: "Kitchen" }],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npc1: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "./images/characters/people/npc1.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "You made it!", faceHero: "npc1" },
            ],
          },
        ],
      }),
      npc2: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "./images/characters/people/npc2.png",
      }),
    },
  },
};
