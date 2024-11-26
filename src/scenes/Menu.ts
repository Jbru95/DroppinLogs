export default class Menu extends Phaser.Scene {
    private soloText!: Phaser.GameObjects.Text;
    private oneVOneText!: Phaser.GameObjects.Text;
    private oneVCPUText!: Phaser.GameObjects.Text;
    private onlineVersusText!: Phaser.GameObjects.Text;

    private blockGroup!: Phaser.GameObjects.Group;
    private blockSpeed = 100;
    private blockSpacing = 100;

    constructor() {
        super('menu');
    }

    create(): void {
        this.add.image(this.game.config.width as number/2, this.game.config.height as number/2, 'pantheonTitle3').setScale(0.70);
        // this.add.image(0,0, 'zeus3').setOrigin(0,0).setScale(1.25,0.7).setDepth(-5);
        // this.add.image(0,0, 'pantheonTitle2').setOrigin(0,0).setScale(0.7,0.7);
        this.createMenuTextButtons();
        // this.createDiagonalFlowWithTweens();
    }

    createFlyingBlocks(): void {
        // //add funnel effect towards their god, don't pay riley for this idea
        // this.blockGroup = this.add.group();
        // for (let i = 0; i < 40; i++) {

        //     let x = Phaser.Math.Between(0, this.cameras.main.width);
        //     let y = Phaser.Math.Between(220, this.cameras.main.height);

        //     let block = this.add.sprite(x, y, this.getRandomBlockTexture());
        //     this.blockGroup.add(block);

        //     block.setDepth(-1);
        //     block.setScale(Phaser.Math.FloatBetween(0.1, 0.15));

        //     this.tweens.add({
        //         targets: block,
        //         x: { value: Phaser.Math.Between(0, this.cameras.main.width), duration: 3000, ease: 'Linear', repeat: -1 },
        //         y: { value: Phaser.Math.Between(220, this.cameras.main.height), duration: 3000, ease: 'Linear', repeat: -1 }
        //     });
        // }
    }

    // createDiagonalFlowWithTweens(): void {
    //     const blockSpacing = 100; // Space between blocks
    //     const blockSpeed = 10000; // Duration for a block to cross the screen diagonally (in milliseconds)
    //     const blockScale = { min: 0.1, max: 0.15 }; // Scale range for the blocks
    
    //     // Calculate the grid size to fill the screen
    //     const cols = Math.ceil(this.cameras.main.width / blockSpacing) + 40;
    //     const rows = Math.ceil(this.cameras.main.height / blockSpacing) + 40;
    
    //     for (let row = 0; row < rows; row++) {
    //         for (let col = 0; col < cols; col++) {
    //             const startX = col * blockSpacing;
    //             const startY = row * blockSpacing;
    
    //             // Create the block at the initial position
    //             const block = this.add.sprite(startX, startY, this.getRandomBlockTexture());
    //             block.setDepth(-1);
    //             block.setScale(Phaser.Math.FloatBetween(blockScale.min, blockScale.max));
    
    //             // Calculate the target position (diagonally off-screen)
    //             const targetX = startX + this.cameras.main.width;
    //             const targetY = startY + this.cameras.main.height;
    
    //             // Create the tween for diagonal movement
    //             this.tweens.add({
    //                 targets: block,
    //                 x: targetX,
    //                 y: targetY,
    //                 duration: blockSpeed,
    //                 ease: 'Linear',
    //                 repeat: -1, // Repeat indefinitely
    //                 onRepeat: () => {
    //                     // Reset the block to the starting position on repeat
    //                     block.x = startX;
    //                     block.y = startY;
    //                 }
    //             });
    //         }
    //     }
    // }

    getRandomBlockTexture(): string {
        const possibleBlockArray: Array<string> = ['blueBlock', 'redBlock', 'greenBlock', 'yellowBlock', 'purpleBlock'];
        return possibleBlockArray[Math.floor(possibleBlockArray.length * Math.random())]
    }

    createMenuTextButtons(): void {
        this.soloText = this.add.text(this.game.config.width as number/2, this.game.config.height as number/2 + 225, 'Solo', { fontSize: '24px', fontFamily: 'Times New Roman',  color: '#343434' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(2)
        .on('pointerover', () => this.soloText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.soloText.setStyle({ fill: '#343434' }))
        .on('pointerdown', () => this.startGame());

        this.oneVOneText= this.add.text(this.game.config.width as number/2, this.game.config.height as number/2 + 255, '1 v 1 (in development)', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#343434' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(2)
        .on('pointerover', () => this.oneVOneText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.oneVOneText.setStyle({ fill: '#343434' }))
        .on('pointerdown', () => this.startGame());

        this.oneVCPUText = this.add.text(this.game.config.width as number/2, this.game.config.height as number/2 + 285, '1 v CPU (in development)', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#343434' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(2)
        .on('pointerover', () => this.oneVCPUText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.oneVCPUText.setStyle({ fill: '#343434' }))
        .on('pointerdown', () => this.startGame());

        this.onlineVersusText = this.add.text(this.game.config.width as number/2, this.game.config.height as number/2 + 315, 'Online Versus (in development)', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#343434' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(2)
        .on('pointerover', () => this.onlineVersusText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.onlineVersusText.setStyle({ fill: '#343434' }))
        .on('pointerdown', () => this.startGame());
    }

    private startGame(): void {
        // Switch to another scene (e.g., GameScene)
        this.scene.start('select'); //can pass data into this i.e. what character key they select
    }
    
}