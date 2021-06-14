window.addEventListener('load', () => {
let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    backgroundColor: 0x999999,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame"
    },
    pixelArt: true,
    scene: [TitleScene, GameScene]
}
const game = new Phaser.Game(config)
}) //end load listener

class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    preload() {
        this.keys;

        this.load.atlas('bgGif', 'assets/sprites/bg.png', 'assets/sprites/bg.json')
        this.load.audio('bg-menu', ['audio/Moments.mp3']);
    } //end preload

    create() {
        this.keys = this.input.keyboard.addKeys({
            space:  Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.anims.create({
            key: 'bgMovingBackground',
            frames: this.anims.generateFrameNames('bgGif', {
                prefix: 'bg-',
                suffix: '.png',
                start: 1,
                end: 19,
                zeroPad: 1
            }),
            frameRate: 9,
            repeat: -1
        });

            var bgAudio = this.sound.add('bg-menu');
            bgAudio.effectsConfig = {
                mute: false,
                volume: 0.1,
                loop: true,
            }
            bgAudio.play(bgAudio.effectsConfig);

        this.add.sprite(0, 0, 'bgGif').setOrigin(0).setScale(0.85).anims.play('bgMovingBackground');

        this.add.text(280, 295, "Created By\nJonas Ramanauskas", { fontSize: '10px', fill: '#FFFFFF' });
        this.add.text(20,245, "Controls:\nAttack: Space\nMove left: A\nMove right: D\nMove up: W\nMove down: S", { fontSize: '11px', fill: '#FFFFFF' });
        this.add.text(150,50, "ONLY ONE", { fontSize: '24px', fill: '#FFFFFF' });
        this.add.text(145,70, "[press space to continue]", { fontSize: '9px', fill: '#FFFFFF' });

    } //end create

    update() {
        if (this.keys.space.isDown){
            this.scene.start("GameScene");
            this.game.sound.stopAll();
        }
    } //end update

} //end title scene
