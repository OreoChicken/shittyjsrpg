class Overworld {
    constructor(config) {
      this.element = config.element;
      this.canvas = this.element.querySelector(".game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.map = null;
    }

    startGameLoop () {

      const step = () => {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Establish Camera Person

        const cameraPerson = this.map.gameObject.hero;

        //Update all objects
        Object.values(this.map.gameObject).forEach(object => {
          object.update({
            arrow: this.directionInput.direction,
            map: this.map
          })

        })

        //Draw Lower Image
        this.map.drawLowerImage(this.ctx, cameraPerson);

        //Draw Game Objects
        Object.values(this.map.gameObject).sort((a,b) => {
          return a.y -b.y;
        }).forEach(object => {
          object.sprite.draw(this.ctx, cameraPerson);
        })

        //Draw Upper Image
        this.map.drawUpperImage(this.ctx, cameraPerson);

        requestAnimationFrame(() => {
          step();
        })
      }
      step();
    }

    bindActionInput() {
      new KeyPressListener("Enter", () => {
        this.map.checkForActionCutscene();
      })
    }

    bindHeroPositionCheck() {
      document.addEventListener("PersonWalkingComplete", e => {
        if (e.detail.whoId === "hero") {
          this.map.checkForFootstepCutscene();
        }
      })
    }

    startMap(mapConfig) {
      this.map = new OverworldMap(mapConfig);
      this.map.overworld = this;
      this.map.mountObjects();
    }

    init() {
      this.startMap(window.OverworldMaps.Bedroom)
      this.map.mountObjects();

      
      this.bindHeroPositionCheck();
      this.bindActionInput();
      

      this.directionInput = new DirectionInput();
      this.directionInput.init()

      


      this.startGameLoop();

      // this.map.startCutscene([
      //   {type: "textMessage", text: "Hello There"}
      //   //{who: "hero", type: "walk", direction:"down", time: 800}
      // ])


    }
  }