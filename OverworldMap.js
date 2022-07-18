class OverworldMap {
    constructor (config) {
        this.overworld = null;
        this.gameObject = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;

    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage, utils.widthGrid(11.5) - cameraPerson.x, utils.widthGrid(6) - cameraPerson.y)

    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImage, utils.widthGrid(11.5) - cameraPerson.x, utils.widthGrid(6) - cameraPerson.y)
        
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x}, ${y}`] || false;
       
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        //Reset NPC idle
        Object.values(this.gameObject).forEach(object => object.doBehaviorEvent(this));
        

    }s

    checkForActionCutscene() {
        console.log('bruh')
        const hero = this.gameObject["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObject).find(object => {
            return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`
        });

        

        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
            
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObject["hero"];
        const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events)
        }

    }

    mountObjects() {
        Object.keys(this.gameObject).forEach(key => {      //Determine if object should actually mount

            let object = this.gameObject[key];

            object.mount(this);
            object.id = key;
        })
    }

    addWall(x,y) {
        this.walls[`${x}, ${y}`] = true;
    }

    removeWall(x,y) {
        delete this.walls[`${x}, ${y}`];
    }

    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const {x, y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }

}

window.OverworldMaps = {
    Bedroom: {
        lowerSrc: "/images/maps/bedroom/bedroomLower.png",
        upperSrc: "/images/maps/bedroom/bedroomUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(9),
                y: utils.widthGrid(3)            
            })
        },
        walls: {
            [utils.asGridCoord(1,3)] : true,
            [utils.asGridCoord(2,3)] : true,
            [utils.asGridCoord(3,3)] : true,
            [utils.asGridCoord(3,2)] : true,
            [utils.asGridCoord(1,6)] : true,
            [utils.asGridCoord(2,2)] : true,
            [utils.asGridCoord(11,5)] : true,
            [utils.asGridCoord(11,6)] : true,
            [utils.asGridCoord(11,3)] : true,
            [utils.asGridCoord(2,2)] : true,
            [utils.asGridCoord(10,3)] : true,
            [utils.asGridCoord(9,2)] : true,
            [utils.asGridCoord(0,4)] : true,
            [utils.asGridCoord(0,5)] : true,
            [utils.asGridCoord(1,1)] : true,
            [utils.asGridCoord(2,1)] : true,
            [utils.asGridCoord(3,1)] : true,
            [utils.asGridCoord(4,1)] : true,
            [utils.asGridCoord(5,1)] : true,
            [utils.asGridCoord(6,1)] : true,
            [utils.asGridCoord(7,1)] : true,
            [utils.asGridCoord(8,1)] : true,
            [utils.asGridCoord(12,4)] : true,
            [utils.asGridCoord(2,6)] : true,
            [utils.asGridCoord(3,6)] : true,
            [utils.asGridCoord(4,6)] : true,
            [utils.asGridCoord(5,6)] : true,
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(9,6)] : true,
            [utils.asGridCoord(10,6)] : true,
            [utils.asGridCoord(5,7)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(6,8)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(6,7)] : [
                {
                    events: [
                        {type: "changeMap", map: "Village"}

                    ]
                }
            ]
        }
    },

    Village: {
        lowerSrc: "/images/maps/village/villageLower.png",
        upperSrc: "/images/maps/village/villageUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.widthGrid(13),
                y: utils.widthGrid(6)            
            }),
            npcGreen: new Person({
                x: utils.widthGrid(3),
                y: utils.widthGrid(11),
                talking: [
                    {
                        events: [
                            {type: "textMessage", text: "Hello There"},
                            {type: "textMessage", text: "amoguse"}
                        ]
                    }
                ]            
            }),
            npcOrange: new Person({
                x: utils.widthGrid(20),
                y: utils.widthGrid(11),
                behaviorLoop: [
                    {type: "stand", direction: "left", time: 100},
                    {type: "stand", direction: "down", time: 800},
                    {type: "stand", direction: "right", time: 1200},
                    {type: "stand", direction: "up", time: 300},
                ],
                talking: [
                    {
                        events: [
                            {type: "textMessage", text: "Hello There"},
                            {type: "textMessage", text: "amoguse"}
                        ]
                    }
                ]      
            }),
            npcTower: new Person({
                x: utils.widthGrid(7),
                y: utils.widthGrid(18),      
                behaviorLoop: [        
                    {type: "stand", direction: "left", time: 800 },
                    {type: "stand", direction: "right", time: 800 }
                    
                ]
            })
            
            
        },
        walls: {
            [utils.asGridCoord(0,-1)] : true,
            [utils.asGridCoord(1,-1)] : true,
            [utils.asGridCoord(2,-1)] : true,
            [utils.asGridCoord(3,-1)] : true,
            [utils.asGridCoord(4,-1)] : true,
            [utils.asGridCoord(5,-1)] : true,
            [utils.asGridCoord(6,-1)] : true,
            [utils.asGridCoord(7,-1)] : true,
            [utils.asGridCoord(8,-1)] : true,
            [utils.asGridCoord(9,-1)] : true,
            [utils.asGridCoord(10,-1)] : true,
            [utils.asGridCoord(11,-1)] : true,
            [utils.asGridCoord(12,-1)] : true,
            [utils.asGridCoord(13,-1)] : true,
            [utils.asGridCoord(14,-1)] : true,
            [utils.asGridCoord(15,-1)] : true,
            [utils.asGridCoord(16,-1)] : true,
            [utils.asGridCoord(17,-1)] : true,
            [utils.asGridCoord(18,-1)] : true,
            [utils.asGridCoord(19,-1)] : true,
            [utils.asGridCoord(20,-1)] : true,
            [utils.asGridCoord(21,-1)] : true,
            [utils.asGridCoord(22,-1)] : true,
            [utils.asGridCoord(23,-1)] : true,
            [utils.asGridCoord(24,-1)] : true,
            [utils.asGridCoord(25,-1)] : true,
            [utils.asGridCoord(26,-1)] : true,
            [utils.asGridCoord(-1,0)] : true,
            [utils.asGridCoord(-1,1)] : true,
            [utils.asGridCoord(-1,2)] : true,
            [utils.asGridCoord(-1,3)] : true,
            [utils.asGridCoord(-1,4)] : true,
            [utils.asGridCoord(-1,5)] : true,
            [utils.asGridCoord(-1,6)] : true,
            [utils.asGridCoord(-1,7)] : true,
            [utils.asGridCoord(-1,8)] : true,
            [utils.asGridCoord(-1,9)] : true,
            [utils.asGridCoord(-1,10)] : true,
            [utils.asGridCoord(-1,11)] : true,
            [utils.asGridCoord(-1,12)] : true,
            [utils.asGridCoord(-1,13)] : true,
            [utils.asGridCoord(-1,14)] : true,
            [utils.asGridCoord(-1,15)] : true,
            [utils.asGridCoord(-1,16)] : true,
            [utils.asGridCoord(-1,17)] : true,
            [utils.asGridCoord(-1,18)] : true,
            [utils.asGridCoord(-1,19)] : true,
            [utils.asGridCoord(-1,20)] : true,
            [utils.asGridCoord(-1,21)] : true,
            [utils.asGridCoord(0,22)] : true,
            [utils.asGridCoord(1,22)] : true,
            [utils.asGridCoord(2,22)] : true,
            [utils.asGridCoord(3,22)] : true,
            [utils.asGridCoord(4,22)] : true,
            [utils.asGridCoord(5,22)] : true,
            [utils.asGridCoord(6,22)] : true,
            [utils.asGridCoord(7,22)] : true,
            [utils.asGridCoord(8,22)] : true,
            [utils.asGridCoord(9,22)] : true,
            [utils.asGridCoord(10,22)] : true,
            [utils.asGridCoord(11,22)] : true,
            [utils.asGridCoord(12,22)] : true,
            [utils.asGridCoord(13,22)] : true,
            [utils.asGridCoord(14,22)] : true,
            [utils.asGridCoord(15,22)] : true,
            [utils.asGridCoord(16,22)] : true,
            [utils.asGridCoord(17,22)] : true,
            [utils.asGridCoord(18,22)] : true,
            [utils.asGridCoord(19,22)] : true,
            [utils.asGridCoord(20,22)] : true,
            [utils.asGridCoord(21,22)] : true,
            [utils.asGridCoord(22,22)] : true,
            [utils.asGridCoord(23,22)] : true,
            [utils.asGridCoord(24,22)] : true,
            [utils.asGridCoord(25,22)] : true,
            [utils.asGridCoord(26,22)] : true,
            [utils.asGridCoord(27,0)] : true,
            [utils.asGridCoord(27,1)] : true,
            [utils.asGridCoord(27,2)] : true,
            [utils.asGridCoord(27,3)] : true,
            [utils.asGridCoord(27,4)] : true,
            [utils.asGridCoord(27,5)] : true,
            [utils.asGridCoord(27,6)] : true,
            [utils.asGridCoord(27,7)] : true,
            [utils.asGridCoord(27,8)] : true,
            [utils.asGridCoord(27,9)] : true,
            [utils.asGridCoord(27,10)] : true,
            [utils.asGridCoord(27,11)] : true,
            [utils.asGridCoord(27,12)] : true,
            [utils.asGridCoord(27,13)] : true,
            [utils.asGridCoord(27,14)] : true,
            [utils.asGridCoord(27,15)] : true,
            [utils.asGridCoord(27,16)] : true,
            [utils.asGridCoord(27,17)] : true,
            [utils.asGridCoord(27,18)] : true,
            [utils.asGridCoord(27,19)] : true,
            [utils.asGridCoord(27,20)] : true,
            [utils.asGridCoord(27,21)] : true,
            [utils.asGridCoord(3,8)] : true,
            [utils.asGridCoord(4,8)] : true,
            [utils.asGridCoord(5,8)] : true,
            [utils.asGridCoord(6,8)] : true,
            [utils.asGridCoord(3,9)] : true,
            [utils.asGridCoord(4,9)] : true,
            [utils.asGridCoord(5,9)] : true,
            [utils.asGridCoord(6,9)] : true,
            [utils.asGridCoord(3,10)] : true,
            [utils.asGridCoord(4,10)] : true,
            [utils.asGridCoord(5,10)] : true,
            [utils.asGridCoord(6,10)] : true,
            [utils.asGridCoord(7,10)] : true,
            [utils.asGridCoord(7,15)] : true,
            [utils.asGridCoord(7,16)] : true,
            [utils.asGridCoord(7,17)] : true,
            [utils.asGridCoord(8,15)] : true,
            [utils.asGridCoord(8,16)] : true,
            [utils.asGridCoord(8,17)] : true,
            [utils.asGridCoord(9,15)] : true,
            [utils.asGridCoord(9,16)] : true,
            [utils.asGridCoord(9,17)] : true,
            [utils.asGridCoord(11,15)] : true,
            [utils.asGridCoord(12,15)] : true,
            [utils.asGridCoord(11,16)] : true,
            [utils.asGridCoord(12,16)] : true,
            [utils.asGridCoord(11,4)] : true,
            [utils.asGridCoord(11,5)] : true,
            [utils.asGridCoord(12,4)] : true,
            [utils.asGridCoord(12,5)] : true,
            [utils.asGridCoord(13,4)] : true,
            [utils.asGridCoord(13,5)] : true,
            [utils.asGridCoord(14,4)] : true,
            [utils.asGridCoord(14,5)] : true,
            [utils.asGridCoord(15,4)] : true,
            [utils.asGridCoord(15,5)] : true,
            [utils.asGridCoord(17,3)] : true,
            [utils.asGridCoord(17,4)] : true,
            [utils.asGridCoord(18,3)] : true,
            [utils.asGridCoord(18,4)] : true,
            [utils.asGridCoord(19,8)] : true,
            [utils.asGridCoord(19,9)] : true,
            [utils.asGridCoord(19,10)] : true,
            [utils.asGridCoord(20,8)] : true,
            [utils.asGridCoord(20,9)] : true,
            [utils.asGridCoord(20,10)] : true,
            [utils.asGridCoord(21,8)] : true,
            [utils.asGridCoord(21,9)] : true,
            [utils.asGridCoord(21,10)] : true,
            [utils.asGridCoord(22,8)] : true,
            [utils.asGridCoord(22,9)] : true,
            [utils.asGridCoord(22,10)] : true,
            [utils.asGridCoord(23,8)] : true,
            [utils.asGridCoord(23,9)] : true,
            [utils.asGridCoord(23,10)] : true,
            [utils.asGridCoord(18,10)] : true,
            [utils.asGridCoord(17,14)] : true,
            [utils.asGridCoord(18,14)] : true,
            [utils.asGridCoord(19,14)] : true,
            [utils.asGridCoord(17,15)] : true,
            [utils.asGridCoord(18,15)] : true,
            [utils.asGridCoord(19,15)] : true,
            [utils.asGridCoord(21,14)] : true,
            [utils.asGridCoord(22,14)] : true,
            [utils.asGridCoord(23,14)] : true,
            [utils.asGridCoord(21,15)] : true,
            [utils.asGridCoord(22,15)] : true,
            [utils.asGridCoord(23,15)] : true,
            [utils.asGridCoord(17,17)] : true,
            [utils.asGridCoord(18,17)] : true,
            [utils.asGridCoord(19,17)] : true,
            [utils.asGridCoord(17,18)] : true,
            [utils.asGridCoord(18,18)] : true,
            [utils.asGridCoord(19,18)] : true,
            [utils.asGridCoord(21,17)] : true,
            [utils.asGridCoord(22,17)] : true,
            [utils.asGridCoord(23,17)] : true,
            [utils.asGridCoord(21,18)] : true,
            [utils.asGridCoord(22,18)] : true,
            [utils.asGridCoord(23,18)] : true

        },
        cutsceneSpaces: {
            [utils.asGridCoord(13,6)]: [
                {
                    events: [
                        {type: "changeMap", map: "Bedroom"}
                    ]
                }
    
            ]
        }
    }
    
}