class Sprite {
    constructor (config) {

        //Set up Image
        
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        };
        // image.src = "/images/sprites/duck/idleAnimation.png";

        //Configure Animation & Initial State
        this.animations = config.animations || {
            "idle-down": [
                [0,0], [1,0], [2,0], [3,0]
            ],
            "idle-up": [
                [0,1], [1,1], [2,1], [3,1]
            ],
            "idle-left": [
                [0,2], [1,2], [2,2], [3,2]
            ],
            "idle-right": [
                [0,3], [1,3], [2,3], [3,3]
            ],
            "walk-down": [
                [0,4], [1,4], [2,4], [3,4], [4,4], [5,4]
            ],
            "walk-up": [
                [0,5], [1,5], [2,5], [3,5], [4,5], [5,5]
            ],
            "walk-left": [
                [0,6], [1,6], [2,6], [3,6], [4,6], [5,6]
            ],
            "walk-right": [
                [0,7], [1,7], [2,7], [3,7], [4,7], [5,7]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idle-down";

        this.currentAnimationFrame = 0

        this.animationFrameLimit = config.animationFrameLimit || 6;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game Object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgresss() {
        //Downtick Frame Progress
        if (this.animationFrameProgress > 0 ) {
            this.animationFrameProgress -= 1;
            return
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;
        
        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 20 + utils.widthGrid(11.5) - cameraPerson.x;
        const y = this.gameObject.y - 25 + utils.widthGrid(6) - cameraPerson.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,frameX * 24,frameY *24,24,24,x,y,24,24)

        this.updateAnimationProgresss();
    }
    
}