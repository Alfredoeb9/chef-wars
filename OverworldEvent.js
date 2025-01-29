class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who]; // NPC1, NPC2
    // fire off a walk instruction on this person
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    // setup handler to complete when correct person is done walking, then resolve event
    const completeHandler = (e) => {
      // react to only the one we care about
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };

    // when browser sees this event fire off
    document.addEventListener("PersonStandComplete", completeHandler);
  }

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
        retry: true,
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

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(
        this.map.gameObjects["hero"].direction
      );
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector(".game-container"));
  }

  init() {
    return new Promise((resolve) => {
      // stand or walk
      this[this.event.type](resolve);
    });
  }
}
