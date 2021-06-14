class Player extends Entity {
    constructor(scene, x, y, textureKey, health) {
        super(scene, x, y, textureKey, "Player");

        const animFrameRate = 8;
        const anims = scene.anims;
        this.textureKey = textureKey;
        this.health = health;
        this.facing = 'down';

        // player movement
        anims.create({
            key: 'player-run-down',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'run_down-',
                suffix: '',
                start: 1,
                end: 8,
                zeroPad: 1
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'player-run-left',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'run_side_left-',
                suffix: '',
                start: 1,
                end: 8,
                zeroPad: 1
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'player-run-right',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'run_side_right-',
                suffix: '',
                start: 1,
                end: 8,
                zeroPad: 1
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'player-run-up',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'run_up-',
                suffix: '',
                start: 1,
                end: 8,
                zeroPad: 1
            }),
            frameRate: animFrameRate,
            repeat: -1
        });

        /////////////
        // key inputs
        // this.cursors = this.input.keyboard.createCursorKeys()
        const {LEFT, RIGHT, UP, DOWN, W, A, S, D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        });

    } // End of constructor

    update() {
        const {keys} = this; //output: this.keys
        const speed = 50;
        const previousVelocity = this.body.velocity.clone();

        this.body.setVelocity(0);
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed);
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed);
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed);
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed);
        }

        this.body.velocity.normalize().scale(speed);

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.anims.play('player-run-up', true);
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('player-run-down', true);
        } else if (keys.left.isDown || keys.a.isDown) {
            this.anims.play('player-run-left', true);
        } else if (keys.right.isDown || keys.d.isDown) {
            this.anims.play('player-run-right', true);
        } else {
            this.anims.stop();

            if(this.anims.currentAnim){
                this.facing = this.anims.currentAnim.key.split('-')[2];
            }
        }
    }
}
