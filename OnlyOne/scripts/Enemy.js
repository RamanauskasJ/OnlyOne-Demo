class Enemy extends Entity{
    constructor(scene, x, y, textureKey, damage, type) {
        super(scene, x, y, textureKey, 'Enemy', type);

        const anims = scene.anims;
        const animFrameRate = 7;
        this.textureKey = textureKey;
        this.damage = damage;
        this.type = type;
        anims.create({
            key: 'enemy-left',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'skeleton-walk-left/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'enemy-right',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'skeleton-walk-right/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'enemy-up',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'skeleton-walk-up/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        });
        anims.create({
            key: 'enemy-down',
            frames: anims.generateFrameNames(this.textureKey,{
                prefix: 'skeleton-walk-down/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        });

        this.speed = 30;
        // set the enemy to walk in random directions
        let dir = Math.floor(Math.random()*4);
        switch (dir){
            case 0:
                this.body.setVelocity(0, -this.speed); // up
                this.anims.play('enemy-up');
                break;
            case 1:
                this.body.setVelocity(-this.speed,0); // left
                this.anims.play('enemy-left');
                break;
            case 2:
                this.body.setVelocity(0, this.speed); // down
                this.anims.play('enemy-down');
                break;
            case 3:
                this.body.setVelocity(this.speed, 0); // right
                this.anims.play('enemy-right');
                break;
            default:
                break;
        }

    } // end of constructor

    update(){
        const {speed} = this //this.speed;
        const enemyblocked = this.body.blocked;

        if (enemyblocked.down || enemyblocked.up || enemyblocked.left || enemyblocked.right) {
            var possibleDirections = [];
            for (const direction in enemyblocked){
                possibleDirections.push(direction);
            }
            const newDirection = possibleDirections[Math.floor(Math.random()*4)+1];
            switch (newDirection){
                case 'up':
                    this.body.setVelocity(0, -this.speed); // up
                    this.anims.play('enemy-up');
                    break;
                case 'down':
                    this.body.setVelocity(-this.speed,0); // left
                    this.anims.play('enemy-left');
                    break;
                case 'left':
                    this.body.setVelocity(0, this.speed); // down
                    this.anims.play('enemy-down');
                    break;
                case 'right':
                    this.body.setVelocity(this.speed, 0); // right
                    this.anims.play('enemy-right');
                    break;
                case 'none':
                    this.body.setVelocity(0, 0); // right
                    this.anims.stop();
                    break;
                default:
                    break;
            }
        }


    } // end of update

} // end of class
