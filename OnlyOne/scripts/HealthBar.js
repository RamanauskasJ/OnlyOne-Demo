class HealthBar{
    constructor(scene, x, y, health) {
        this.scene = scene;
        this.currentHealth = health;
        this.x = x;
        this.y = y;

        this.graphics = this.scene.add.graphics();
        this.graphics2 = this.scene.add.graphics();
        this.newGraphics = this.scene.add.graphics();
        const healthBarBackground = new Phaser.Geom.Rectangle(x+32,y,104,12);
        const healthBarBackground2 = new Phaser.Geom.Rectangle(x+34,y+2,100,8);
        const healthBarFill = new Phaser.Geom.Rectangle(x+34, y+2, this.currentHealth,8);

        this.graphics.fillStyle(0xfffffff, 0.5);
        this.graphics2.fillStyle(0xff0099, 1);
        this.graphics.fillRectShape(healthBarBackground);
        this.graphics2.fillRectShape(healthBarBackground2);
        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(healthBarFill);

        this.scene.add.text(x, y+2, 'Health',{fontSize: '8px', fill: '#fff'});

    } // end of constructor
    updateHealth(health){
        this.currentHealth = health;

        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3587e2, 1);
        const healthBarFill = new Phaser.Geom.Rectangle(this.x+34, this.y+2, this.currentHealth, 8);
        this.newGraphics.fillRectShape(healthBarFill);
    }
}
