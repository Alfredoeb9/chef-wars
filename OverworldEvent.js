class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {}

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who]; // NPC1, NPC2
    // fire off a walk instruction on this person
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
      }
    );

    // setup handler to complete when correct person is done walking, then resolve event
    const completeHandler = (e) => {
      // react to only the one we care about
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    // when browser sees this event fire off
    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  init() {
    return new Promise((resolve) => {
      // stand or walk
      this[this.event.type](resolve);
    });
  }
}
