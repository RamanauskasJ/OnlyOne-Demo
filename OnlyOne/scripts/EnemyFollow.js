class EnemyFollow extends Enemy{
    constructor(scene, x, y, textureKey, damage, type,speed){
        super(scene,x,y,textureKey,'Enemy',type)

        this.speed = 50;
        this.chasing = true;
        this.storedTime = 0;
        this.damage = damage;

    }//end create

    update(destination, time){
        const {speed} = this;
        if (this.chasing){
                this.body.setVelocity(0,0)
                const dx = Math.abs(this.body.x - destination.x)
                const dy = Math.abs(this.body.y - destination.y)
                if (dx > dy){
                    //close x gap
                    if (this.body.x < destination.x){
                        //move right
                        this.body.setVelocity(speed, 0)
                        this.anims.play('enemy-right',true)
                    }else {
                        //move left
                        this.body.setVelocity(-speed, 0)
                        this.anims.play('enemy-left',true)
                    }
                }else{
                    //close y gap
                    if (this.body.y < destination.y){
                        //move down
                        this.body.setVelocity(0,speed)
                        this.anims.play('enemy-down',true)
                    }else{
                        //move up
                        this.body.setVelocity(0,-speed)
                        this.anims.play('enemy-up',true)
                    }
                }
                this.body.velocity.normalize().scale(speed)
        }//end chase

        /////////
        const enemyBlocked = this.body.blocked

        if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right){
            this.chasing = false

            this.scene.time.addEvent({
                delay: 2000,
                callback: ()=>{
                    this.chasing = true
                },
                callbackScope: this.scene,
                loop: false
            })
            // console.log(enemyBlocked);
            let possibleDirections = []
            for (const direction in enemyBlocked){
                possibleDirections.push(direction)
            }

            const newDirection = possibleDirections[Math.floor(Math.random()*4)+1]
            // console.log(newDirection);
            switch (newDirection) {
                case 'up':
                    this.body.setVelocity(0,-this.speed)//up
                    this.anims.play('enemy-up')
                    break
                case 'left':
                    this.body.setVelocity(-this.speed,0)//left
                    this.anims.play('enemy-left')
                    break
                case 'down':
                    this.body.setVelocity(0,this.speed)//down
                    this.anims.play('enemy-down')
                    break
                case 'right':
                    this.body.setVelocity(this.speed,0)//right
                    this.anims.play('enemy-right')
                    break
                case 'none':
                    this.body.setVelocity(0,0)//right
                    this.anims.stop()
                    break
                default:
                    break;
            }//end switch

        }
        //////////
    }//end update

}//end class
