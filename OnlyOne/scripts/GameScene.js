class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    preload()
    {
        this.cursors;
        this.enemy;
        this.enemies;
        this.player;
        this.healthBar;
        this.projectiles;
        this.keys;
        this.lastFiredTime = 0;
        this.emitter;
        this.gems;
        this.coins;
        this.score = 0;
        this.scoreText;
        this.gameOver = false;
        this.restartText = 'Press Space to restart';
        this.counter = 0;

        this.load.image('spear', 'assets/spear.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('tiles', 'assets/Tilemap/mainlevbuild.png');

        this.load.tilemapTiledJSON('map', 'assets/Tilemap/OnlyOne-Map.json');

        this.load.atlas('skeleton', 'assets/sprites/skeleton.png', 'assets/sprites/skeleton.json');
        this.load.atlas('onlyone-movement', 'assets/sprites/onlyone.png', 'assets/sprites/onlyone.json');

        this.load.audio('throw', ['audio/throw.mp3']);
        this.load.audio('skeleton-death', ['audio/skeleton-death.mp3']);
        this.load.audio('bg-audio', ['audio/Last-Stand.mp3']);

    } //end of preload

    create()
    {
        const map = this.make.tilemap({
            key: 'map'
        });
        const tileset = map.addTilesetImage('mainlevbuild', 'tiles');
        const belowLayer = map.createStaticLayer('Ground', tileset, 0, 0);
        const worldLayer = map.createStaticLayer('Walls', tileset, 0, 0);
        const obstacles = map.createStaticLayer('Obstacles', tileset, 0, 0);
        const pickups = map.createStaticLayer('Pickups', tileset, 0, 0);

        worldLayer.setDepth(0);
        obstacles.setDepth(1);
        worldLayer.setCollisionByProperty({
            collides: true
        });
        obstacles.setCollisionByProperty({
            collides: true
        });

        // Add score and gameOver text
        this.scoreText = this.add.text(20, 35, 'score: 0', { fontSize: '10px', fill: '#FFFFFF' });
        this.gameOverText = this.add.text(40, 120, 'Game Over', { fontSize: '64px', fill: '#FFFFFF' });
        this.gameWinText = this.add.text(80, 120, 'You won', { fontSize: '64px', fill: '#FFFFFF' });
        this.gameOverText.visible = false;
        this.gameWinText.visible = false;

        // Add collision to world bounds
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Create player
        this.player = new Player(this,100,150,"onlyone-movement", 100);
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8);

        // Create group of normal enemies
        this.enemies = this.add.group()
        for (let i = 0; i < 50; i++) {
            const e = new Enemy(this, 200 + 5*i, 150, 'skeleton', 10, 'wandering10');
            e.body.setCollideWorldBounds(true);
            e.setTint(0x9999ff);
            this.enemies.add(e);
        }

        // Create a group of stronger enemies
        this.enemiesWhite = this.add.group()
        for (let i = 0; i < 10; i++) {
            const e = new Enemy(this, 200 + 10*i, 150, 'skeleton', 50, 'wandering50');
            e.body.setCollideWorldBounds(true);
            this.enemiesWhite.add(e);
        }

        // Create enemy that follows the player
        this.enemyFollowsPlayer = new EnemyFollow(this, 200, 180, 'skeleton', 50, 'follow50').setTint(0x00ff00);
        this.enemyFollowsPlayer.body.setCollideWorldBounds(true);

        // Player collision with the world
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, obstacles);
        this.player.body.setCollideWorldBounds(true);

        // Player collision with the enemy
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.enemiesWhite, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.enemyFollowsPlayer, this.handlePlayerEnemyCollision, null, this);

        // Enemies collisions with the world
        this.physics.add.collider(this.enemiesWhite, worldLayer);
        this.physics.add.collider(this.enemiesWhite, obstacles);
        this.physics.add.collider(this.enemies, worldLayer);
        this.physics.add.collider(this.enemies, obstacles);
        this.physics.add.collider(this.enemyFollowsPlayer, worldLayer);
        this.physics.add.collider(this.enemyFollowsPlayer, obstacles);

        // HealthBar
        this.healthBar = new HealthBar(this, 20,18, 100);

        // Projectiles
        this.keys = this.input.keyboard.addKeys({
           space: 'SPACE'
        });
        this.projectiles = new Projectiles(this);

        // Projectile collision with the enemies
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.enemiesWhite, this.handleProjectileEnemyCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.enemyFollowsPlayer, this.handleProjectileEnemyCollision, null, this);

        //Projectile collision with the world
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this);
        this.physics.add.collider(this.projectiles, obstacles, this.handleProjectileWorldCollision, null, this);

        // Particles
        this.emitter = this.add.particles('particle').createEmitter({
            x: 0,
            y: 0,
            quantity: 15,
            speed: {min: -100, max: 100},
            angle: {min: 0, max: 360},
            scale: {start: 0.5, end: 0},
            lifespan: 500,
            active: false
        });

    } //end of create

    // Audio methods with configurations
    playSkeletonDeathAudio(){
        var skeletonDeathAudio = this.sound.add('skeleton-death');
        this.effectsConfig = {
            mute: false,
            volume: 0.2,
            rate: 2,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        skeletonDeathAudio.play(this.effectsConfig);
    }

     playSpearThrowingAudio(){
        var throwAudio = this.sound.add('throw');
        this.effectsConfig = {
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        throwAudio.play(this.effectsConfig);
    }

    playBgAudio(){
        var bgAudio = this.sound.add('bg-audio');
        bgAudio.effectsConfig = {
        mute: false,
        volume: 0.1,
        loop: true,
        }
        bgAudio.play(bgAudio.effectsConfig)
    }

    stopAllAudio(){
        this.game.sound.stopAll();
    }
    // Audio section ending

    handleProjectileEnemyCollision(enemy, projectile){
        if(projectile.active){
            enemy.setTint(0xff0000);
            this.time.addEvent({
                delay: 30,
                callback: ()=>{
                    enemy.explode();
                    projectile.recycle();
                    this.score += 5;
                    this.scoreText.setText('Score:'+ this.score);
                },
                callbackScope: this,
                loop: false
            });
            this.emitter.active = true;
            this.emitter.setPosition(enemy.x, enemy.y);
            this.emitter.explode();
            this.playSkeletonDeathAudio();
        }
    }

    handleProjectileWorldCollision(p){
       p.recycle();
       this.projectiles.killAndHide(p);
    }

    handlePlayerEnemyCollision(p,e){
        // take damage when you touch an enemy
        p.health -= e.damage;
        this.healthBar.updateHealth(p.health);
        // restart if player health reaches 50
        if (p.health <= 0){
            this.cameras.main.shake(100, 0.05);
            this.gameOver = true;
        }else{
            // shake the camera when you touch an enemy
            this.cameras.main.shake(20, 0.02);
            // set red tint on the player when you touch an enemy
            p.setTint(0xff0000);
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    p.clearTint();
                },
                callbackScope: this,
                loop: false
            });
            e.explode();
        }
    }

    update(time)
    {
        if(this.score >= 300){
            this.gameWinText.visible=true;
            this.gameWinText.setDepth(5);
            this.physics.pause();
            this.stopAllAudio()
            this.restartText = this.add.text(140, 180, 'press space to restart', { fontSize: '12px', fill: '#FFFFFF' });
            if (this.keys.space.isDown) {
                this.stopAllAudio()
                this.scene.start('titleScene');
            }
        }

        if(this.counter === 0){
            this.playBgAudio();
            this.counter++;
        }else{
            if(this.gameOver === true) {
                this.player.setTint(0xff0000);
                this.gameOverText.visible = true;
                this.gameOverText.setDepth(5);
                this.physics.pause();

                this.restartText = this.add.text(140, 180, 'press space to restart', {
                    fontSize: '12px',
                    fill: '#FFFFFF'
                });
                if (this.keys.space.isDown) {
                    this.stopAllAudio()
                    this.scene.start('titleScene');
                }
            }
        }

        if (this.keys.space.isDown) {
            if(time > this.lastFiredTime){
                this.lastFiredTime = time + 700;
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing);
                this.playSpearThrowingAudio();
            }
        }

        this.player.update();
        if (!this.enemyFollowsPlayer.isDead){
            this.enemyFollowsPlayer.update(this.player.body.position);
        }
        this.enemies.children.iterate((child) =>{
            if (!child.isDead){
                child.update();
            }
        });
        this.enemiesWhite.children.iterate((child) =>{
            if (!child.isDead){
                child.update();
            }
        });

    } //end of update

} //end gameScene
